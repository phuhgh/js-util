#pragma once

namespace JsUtil
{

PoolWorkerConfig::PoolWorkerConfig(uint16_t jobQueueSize)
    : m_jobs(
          CircularFIFOStack<gsl::owner<IExecutor*>, ECircularStackOverflowMode::NoOp, uint16_t, std::atomic<uint16_t>>(
              jobQueueSize
          )
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
        delete m_jobs.pop();
    }
}

PoolWorkerConfig& PoolWorkerConfig::operator=(JsUtil::PoolWorkerConfig&& other) noexcept
{
    if (this != &other)
    {
        m_jobs = std::move(other.m_jobs);
        // the destructor deletes all the jobs, guard against "unspecified" state
        other.m_jobs = CircularFIFOStack<
            gsl::owner<IExecutor*>,
            ECircularStackOverflowMode::NoOp,
            uint16_t,
            std::atomic<uint16_t>>{0};
    }

    return *this;
}

void PoolWorkerConfig::setJobQueueSize(uint16_t jobQueueSize)
{
    Debug::debugAssert(m_jobs.getIsEmpty(), "changing job queue size with jobs queued will destroy jobs");
    m_jobs =
        CircularFIFOStack<gsl::owner<IExecutor*>, ECircularStackOverflowMode::NoOp, uint16_t, std::atomic<uint16_t>>{
            jobQueueSize
        };
}

void PoolWorkerConfig::onTick()
{
    while (!m_jobs.getIsEmpty())
    {
        auto* job = m_jobs.pop();
        job->run();
        delete job;
    }
}

template <IsDistributionStrategy TDistributionStrategy> WorkerPool<TDistributionStrategy>::~WorkerPool()
{
    // the stop method is more optimized than just relying on destructors (which would serial wait)
    stop(true);
    for (auto* worker : m_workers.asSpan())
    {
        delete worker;
    }
}

template <IsDistributionStrategy TDistributionStrategy>
WorkerPool<TDistributionStrategy>::WorkerPool(TDistributionStrategy strategy, WorkerPoolConfig const& config)
    : m_workers(ResizableArray<gsl::owner<WorkerLoop<PoolWorkerConfig>*>, uint16_t>::createPointerArray(
          config.workerCount,
          []() -> gsl::owner<WorkerLoop<PoolWorkerConfig>*> {
              return new (std::nothrow) WorkerLoop<PoolWorkerConfig>();
          }
      ))
    , m_strategy(std::move(strategy))
{
    m_strategy.configure(config);
    for (auto& worker : m_workers.asSpan())
    {
        worker->getTask().setJobQueueSize(config.jobCount);
    }
}

template <IsDistributionStrategy TDistributionStrategy> uint16_t WorkerPool<TDistributionStrategy>::start()
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

template <IsDistributionStrategy TDistributionStrategy> void WorkerPool<TDistributionStrategy>::stop(bool wait)
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

template <IsDistributionStrategy TDistributionStrategy> bool WorkerPool<TDistributionStrategy>::isReady() const
{
    bool isReady{true};
    for (auto& worker : m_workers.asSpan())
    {
        isReady = isReady && worker->getTask().isAcceptingWork();
    }
    return isReady;
}

template <IsDistributionStrategy TDistributionStrategy>
bool WorkerPool<TDistributionStrategy>::isAnyWorkerRunning() const
{
    bool isRunning{false};
    for (auto& worker : m_workers.asSpan())
    {
        isRunning = isRunning || worker->isRunning();
    }
    return isRunning;
}

template <IsDistributionStrategy TDistributionStrategy> bool WorkerPool<TDistributionStrategy>::hasPendingWork() const
{
    bool hasPendingWork{false};
    for (auto& worker : m_workers.asSpan())
    {
        hasPendingWork = hasPendingWork || worker->getTask().hasPendingWork();
    }
    return hasPendingWork;
}

template <IsDistributionStrategy TDistributionStrategy> void WorkerPool<TDistributionStrategy>::setBatchReadyPoint()
{
    for (auto& worker : m_workers.asSpan())
    {
        worker->getTask().setBatchReadyPoint();
    }
}

// todo jack: definitely need tests on the cpp side for this
template <IsDistributionStrategy TDistributionStrategy> bool WorkerPool<TDistributionStrategy>::isBatchDone()
{
    auto ready{true};
    for (auto& worker : m_workers.asSpan())
    {
        ready = ready && worker->getTask().isBatchDone();
    }
    return ready;
}

bool RoundRobin::distributeWork(std::span<WorkerLoop<PoolWorkerConfig>*> o_workers, gsl::owner<IExecutor*> job)
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

} // namespace JsUtil
