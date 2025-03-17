#pragma once

namespace JsUtil
{

WorkerPoolTaskConfig::WorkerPoolTaskConfig(uint16_t jobQueueSize)
    : m_jobs(CircularFIFOStack<std::shared_ptr<IExecutor>, ECircularStackOverflowMode::NoOp, uint16_t>(jobQueueSize))
{
}

WorkerPoolTaskConfig::WorkerPoolTaskConfig(WorkerPoolTaskConfig&& other) noexcept
    : m_jobs(std::move(other.m_jobs))
{
}

WorkerPoolTaskConfig& WorkerPoolTaskConfig::operator=(JsUtil::WorkerPoolTaskConfig&& other) noexcept
{
    if (this != &other)
    {
        m_jobs = std::move(other.m_jobs);
        // the destructor deletes all the jobs, guard against "unspecified" state
        other.m_jobs = CircularFIFOStack<std::shared_ptr<IExecutor>, ECircularStackOverflowMode::NoOp, uint16_t>{0};
    }

    return *this;
}

void WorkerPoolTaskConfig::setJobQueueSize(uint16_t jobQueueSize)
{
    Debug::debugAssert(m_jobs.getIsEmpty(), "changing job queue size with jobs queued will destroy jobs");
    m_jobs = CircularFIFOStack<std::shared_ptr<IExecutor>, ECircularStackOverflowMode::NoOp, uint16_t>{jobQueueSize};
}

void WorkerPoolTaskConfig::onTick()
{
    while (true)
    {
        std::shared_ptr<IExecutor> job;
        bool                       runJob{false};
        {
            std::unique_lock lock(m_state_mutex);

            if (m_jobs.getIsEmpty())
            {
                break;
            }

            job = m_jobs[0];
            runJob = m_jobs.getAbsoluteStart() >= m_invalidateToIndex;
        }

        if (runJob)
        {
            job->run();
        }

        std::unique_lock lock(m_state_mutex);
        m_jobs.pop();
    }
}

template <WithDistributionStrategy TDistributionStrategy>
WorkerPool<TDistributionStrategy>::~WorkerPool()
{
    // the stop method is more optimized than just relying on destructors (which would serial wait)
    stop(true);
}

template <WithDistributionStrategy TDistributionStrategy>
WorkerPool<TDistributionStrategy>::WorkerPool(TDistributionStrategy strategy, WorkerPoolConfig const& config)
    : m_workers(
          ResizableArray<std::unique_ptr<WorkerLoop<WorkerPoolTaskConfig>>, uint16_t>::createPointerArray(
              config.workerCount,
              [&config]() {
                  return std::unique_ptr<WorkerLoop<WorkerPoolTaskConfig>>{new (std::nothrow
                  ) WorkerLoop(WorkerPoolTaskConfig{config.jobCount})};
              }
          )
      )
    , m_strategy(std::move(strategy))
    , m_syncOverflowHandling(config.syncOverflowHandling)
{
    m_strategy.configure(config);
    for (auto& worker : m_workers.asSpan())
    {
        worker->getTaskConfig().setJobQueueSize(config.jobCount);
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
            workerPtr.reset();
        }
    }

    if (startedCount != m_workers.size())
    {
        static auto const sTAGS = std::array<char const*, 2>{{"WASM", "THREADING"}};
        Debug::verboseLog("failed to start all worker threads", sTAGS);
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
        isAcceptingJobs = isAcceptingJobs && worker->getTaskConfig().isAcceptingWork();
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
        hasPendingWork = hasPendingWork || worker->getTaskConfig().hasPendingWork();
    }
    return hasPendingWork;
}

template <WithDistributionStrategy TDistributionStrategy>
void WorkerPool<TDistributionStrategy>::setBatchEndPoint() noexcept
{
    for (auto& worker : m_workers.asSpan())
    {
        worker->getTaskConfig().setBatchEndPoint();
    }
}

// todo jack: definitely need tests on the cpp side for this
template <WithDistributionStrategy TDistributionStrategy>
bool WorkerPool<TDistributionStrategy>::isBatchDone() const noexcept
{
    auto ready{true};
    for (auto& worker : m_workers.asSpan())
    {
        ready = ready && worker->getTaskConfig().isBatchDone();
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
        static auto const sTAGS = std::array<char const*, 2>{{"WASM", "THREADING"}};
        Debug::verboseLog("job overflow, running synchronously...", sTAGS);
        job->run();
    }
    return jobAdded;
}

template <WithDistributionStrategy TDistributionStrategy>
void WorkerPool<TDistributionStrategy>::invalidateBatch() noexcept
{
    for (auto& worker : m_workers.asSpan())
    {
        worker->getTaskConfig().invalidateBatch();
    }
}

template <WithDistributionStrategy TDistributionStrategy>
bool WorkerPool<TDistributionStrategy>::areAllWorkersSynced() const noexcept
{
    bool synced{true};
    for (auto& worker : m_workers.asSpan())
    {
        synced = synced && worker->getTaskConfig().isWorkerSynced();
    }
    return synced;
}

bool RoundRobin::distributeWork(
    std::span<std::unique_ptr<WorkerLoop<WorkerPoolTaskConfig>>> o_workers,
    std::shared_ptr<IExecutor>                                   job
) noexcept
{
    if (o_workers.empty())
    {
        return false;
    }
    auto& worker = o_workers[m_index];
    m_index = (m_index + 1) % o_workers.size();

    if (!worker->isRunning())
    {
        Debug::error("expected worker to have been started");
        return false;
    }

    auto added = worker->getTaskConfig().addJob(job);
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
    // no action required
}

inline bool PassToAll::distributeWork(
    std::span<std::unique_ptr<WorkerLoop<WorkerPoolTaskConfig>>> o_workers,
    std::shared_ptr<IExecutor>                                   job
) noexcept
{
    bool allStarted{true};

    for (auto& worker : o_workers)
    {
        if (worker->isRunning())
        {
            bool added = worker->getTaskConfig().addJob(job);
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
