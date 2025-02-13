#pragma once

namespace JsUtil
{

PoolWorkerConfig::PoolWorkerConfig(uint16_t jobQueueSize)
    : m_jobs(
          CircularFIFOStack<
              std::shared_ptr<IExecutor>,
              ECircularStackOverflowMode::NoOp,
              uint16_t,
              std::atomic<uint16_t>>(jobQueueSize)
      )
{
}

PoolWorkerConfig::PoolWorkerConfig(PoolWorkerConfig&& other) noexcept
    : m_jobs(std::move(other.m_jobs))
{
}

PoolWorkerConfig::~PoolWorkerConfig()
{
    while (!m_jobs.getIsEmpty())
    {
        m_jobs.pop();
    }
}

PoolWorkerConfig& PoolWorkerConfig::operator=(JsUtil::PoolWorkerConfig&& other) noexcept
{
    if (this != &other)
    {
        m_jobs = std::move(other.m_jobs);
        // the destructor deletes all the jobs, guard against "unspecified" state
        other.m_jobs = CircularFIFOStack<
            std::shared_ptr<IExecutor>,
            ECircularStackOverflowMode::NoOp,
            uint16_t,
            std::atomic<uint16_t>>{0};
    }

    return *this;
}

void PoolWorkerConfig::setJobQueueSize(uint16_t jobQueueSize)
{
    Debug::debugAssert(m_jobs.getIsEmpty(), "changing job queue size with jobs queued will destroy jobs");
    m_jobs = CircularFIFOStack<
        std::shared_ptr<IExecutor>,
        ECircularStackOverflowMode::NoOp,
        uint16_t,
        std::atomic<uint16_t>>{jobQueueSize};
}

void PoolWorkerConfig::onTick()
{
    while (!m_jobs.getIsEmpty())
    {
        auto invalidateToIndex = m_invalidateToIndex.load();
        if (invalidateToIndex == 0)
        {
            // no invalidation has been requested, run the job
            // we rely on indexes to determine if we're in a valid state, so do the pop after the work
            m_jobs[0]->run(); // the circular buffer will translate for us...
            m_jobs.pop();     // it's a circular buffer, the pop moves the front
        }
        else
        {
            // producer has asked us to invalidate up to a job index
            while (m_jobs.getAbsoluteStart() < invalidateToIndex)
            {
                Debug::debugAssert(!m_jobs.getIsEmpty(), "unexpected state, probably received invalid index...");
                m_jobs.pop();
            }
            // reset, assuming the value hasn't changed, otherwise just go around again...
            m_invalidateToIndex.compare_exchange_weak(invalidateToIndex, 0);
        }
    }
}

template <WithDistributionStrategy TDistributionStrategy>
WorkerPool<TDistributionStrategy>::~WorkerPool()
{
    // the stop method is more optimized than just relying on destructors (which would serial wait)
    stop(true);
    for (auto* worker : m_workers.asSpan())
    {
        delete worker;
    }
}

template <WithDistributionStrategy TDistributionStrategy>
WorkerPool<TDistributionStrategy>::WorkerPool(TDistributionStrategy strategy, WorkerPoolConfig const& config)
    : m_workers(
          ResizableArray<gsl::owner<WorkerLoop<PoolWorkerConfig>*>, uint16_t>::createPointerArray(
              config.workerCount,
              []() -> gsl::owner<WorkerLoop<PoolWorkerConfig>*> {
                  return new (std::nothrow) WorkerLoop<PoolWorkerConfig>();
              }
          )
      )
    , m_strategy(std::move(strategy))
    , m_syncOverflowHandling(config.syncOverflowHandling)
{
    m_strategy.configure(config);
    for (auto& worker : m_workers.asSpan())
    {
        worker->getTask().setJobQueueSize(config.jobCount);
    }
}

template <WithDistributionStrategy TDistributionStrategy>
uint16_t WorkerPool<TDistributionStrategy>::start()
{
    uint16_t startedCount{0};
    for (auto& workerPtr : m_workers.asSpan())
    {
        if (workerPtr->start())
        {
            ++startedCount;
        }
        else
        {
            delete workerPtr;
            workerPtr = nullptr;
        }
    }

    if (startedCount != m_workers.size())
    {
        Debug::verboseLog("failed to start all worker threads");
        m_workers.compact();
    }

    return startedCount;
}

template <WithDistributionStrategy TDistributionStrategy>
void WorkerPool<TDistributionStrategy>::stop(bool wait) noexcept
{
    // stop in parallel
    for (auto& worker : m_workers.asSpan())
    {
        worker->stop(false);
    }

    if (wait)
    {
        for (auto& worker : m_workers.asSpan())
        {
            worker->stop(true);
        }
    }
}

template <WithDistributionStrategy TDistributionStrategy>
bool WorkerPool<TDistributionStrategy>::isAcceptingJobs() const noexcept
{
    bool isAcceptingJobs{true};
    for (auto& worker : m_workers.asSpan())
    {
        isAcceptingJobs = isAcceptingJobs && worker->getTask().isAcceptingWork();
    }
    return isAcceptingJobs;
}

template <WithDistributionStrategy TDistributionStrategy>
bool WorkerPool<TDistributionStrategy>::isAnyWorkerRunning() const noexcept
{
    bool isRunning{false};
    for (auto& worker : m_workers.asSpan())
    {
        isRunning = isRunning || worker->isRunning();
    }
    return isRunning;
}

template <WithDistributionStrategy TDistributionStrategy>
bool WorkerPool<TDistributionStrategy>::hasPendingWork() const noexcept
{
    bool hasPendingWork{false};
    for (auto& worker : m_workers.asSpan())
    {
        hasPendingWork = hasPendingWork || worker->getTask().hasPendingWork();
    }
    return hasPendingWork;
}

template <WithDistributionStrategy TDistributionStrategy>
void WorkerPool<TDistributionStrategy>::setBatchEndPoint() noexcept
{
    for (auto& worker : m_workers.asSpan())
    {
        worker->getTask().setBatchEndPoint();
    }
}

// todo jack: definitely need tests on the cpp side for this
template <WithDistributionStrategy TDistributionStrategy>
bool WorkerPool<TDistributionStrategy>::isBatchDone() const noexcept
{
    auto ready{true};
    for (auto& worker : m_workers.asSpan())
    {
        ready = ready && worker->getTask().isBatchDone();
    }
    return ready;
}

template <WithDistributionStrategy TDistributionStrategy>
bool WorkerPool<TDistributionStrategy>::addJob(std::shared_ptr<IExecutor> job) noexcept
{
    if (job == nullptr)
    {
        Debug::error("expected a job, got a nullptr...");
        return false;
    }

    auto jobAdded = m_strategy.distributeWork(m_workers.asSpan(), job);
    if (!jobAdded && m_syncOverflowHandling)
    {
        // handle backpressure by throttling the producer... not pretty but will "work"...
        Debug::verboseLog("job overflow, running synchronously...");
        job->run();
    }
    return jobAdded;
}

template <WithDistributionStrategy TDistributionStrategy>
void WorkerPool<TDistributionStrategy>::invalidateBatch() noexcept
{
    for (auto& worker : m_workers.asSpan())
    {
        worker->getTask().invalidateBatch();
    }
}

template <WithDistributionStrategy TDistributionStrategy>
bool WorkerPool<TDistributionStrategy>::areAllWorkersSynced() const noexcept
{
    bool synced{true};
    for (auto& worker : m_workers.asSpan())
    {
        synced = synced && worker->getTask().isWorkerSynced();
    }
    return synced;
}

bool RoundRobin::distributeWork(
    std::span<WorkerLoop<PoolWorkerConfig>*> o_workers,
    std::shared_ptr<IExecutor>               job
) noexcept
{
    if (o_workers.empty())
    {
        return false;
    }
    auto  index = m_index % o_workers.size();
    auto& worker = o_workers[index];
    m_index = (index + 1) % o_workers.size();

    if (!worker->isRunning())
    {
        Debug::error("expected worker to have been started");
        return false;
    }

    auto added = worker->getTask().addJob(job);
    if (added)
    {
        worker->proceed();
    }

    return added;
}

void RoundRobin::configure(WorkerPoolConfig const&)
{
    m_index = 0;
}

inline void PassToAll::configure(WorkerPoolConfig const&)
{
    // no action required?
    // todo jack: is that true?
}

inline bool PassToAll::distributeWork(
    std::span<WorkerLoop<PoolWorkerConfig>*> o_workers,
    std::shared_ptr<IExecutor>               job
) noexcept
{
    bool allStarted{true};

    for (auto& worker : o_workers)
    {
        if (worker->isRunning())
        {
            bool added = worker->getTask().addJob(job);
            allStarted = allStarted && added;
            if (added)
            {
                worker->proceed();
            }
        }
        else
        {
            Debug::error("expected worker to have been started");
            allStarted = false;
        }
    }

    return allStarted;
}

} // namespace JsUtil
