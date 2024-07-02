#pragma once

#include "JsUtil/Threading.h"
#include "JsUtil/WorkerLoop.h"
#include <gsl/pointers>

namespace JsUtil
{
/**
 * @remark Only thread safe in for single producer consumer pair.
 */
class PoolWorkerConfig : public IWorkerLoopConfig
{
  public:
    // todo jack: handle allocation failure?
    inline explicit PoolWorkerConfig(uint16_t jobQueueSize = 32);
    inline PoolWorkerConfig(PoolWorkerConfig&& other) noexcept;
    inline ~PoolWorkerConfig() override;
    inline PoolWorkerConfig& operator=(PoolWorkerConfig&& other) noexcept;
    PoolWorkerConfig(PoolWorkerConfig& other) = delete;
    PoolWorkerConfig& operator=(PoolWorkerConfig& other) = delete;

    bool        hasPendingWork() const { return !m_jobs.getIsEmpty(); }
    bool        addJob(gsl::owner<IExecutor*> job) { return m_jobs.push(std::move(job)); }
    inline void setJobQueueSize(uint16_t jobQueueSize);
    void        setBatchReadyPoint() { m_completionPoint = m_jobs.getAbsoluteEnd(); };
    bool        isBatchDone() { return m_jobs.getAbsoluteStart() >= m_completionPoint; };
    bool        isAcceptingWork() const { return m_acceptingWork; }

  public: // from IWorkerLoopConfig
    void        onRegistered(JsUtil::INotifiable*) override {}
    void        onReady() override { m_acceptingWork = true; }
    inline void onTick() override;
    void        onComplete() override { m_acceptingWork = false; }

    // todo jack: proper handling of jobs that can't be added (have the caller run it...)
  private:
    CircularFIFOStack<gsl::owner<IExecutor*>, ECircularStackOverflowMode::NoOp, uint16_t, std::atomic<uint16_t>> m_jobs;
    std::atomic<unsigned> m_completionPoint = -1;
    std::atomic<bool>     m_acceptingWork = false;
};

struct WorkerPoolConfig
{
    uint16_t workerCount{4};
    uint16_t jobCount{32};
};

struct IDistributionStrategy
{
    virtual ~IDistributionStrategy() = default;
    virtual void configure(WorkerPoolConfig const& config) = 0;
    virtual bool distributeWork(std::span<WorkerLoop<PoolWorkerConfig>*> o_workers, gsl::owner<IExecutor*> job) = 0;
};

template <typename T>
concept IsDistributionStrategy = std::is_base_of_v<IDistributionStrategy, T>;

struct IWorkerPool : public ISharedMemoryObject
{
    ~IWorkerPool() override = default;
    virtual uint16_t start() = 0;
    virtual void     stop(bool wait) = 0;
    virtual void     addJob(gsl::owner<IExecutor*> job) = 0;
    virtual bool     hasPendingWork() const = 0;
    /// to accept jobs
    virtual bool isReady() const = 0;
    virtual bool isAnyWorkerRunning() const = 0;

    virtual void setBatchReadyPoint() = 0;
    virtual bool isBatchDone() = 0;
};

/**
 * @remark TDistributionStrategy sets the thread safety of `addJob`. Other methods are NOT thread safe (unless marked).
 */
template <IsDistributionStrategy TDistributionStrategy> class WorkerPool final : public IWorkerPool
{
  public:
    inline WorkerPool(TDistributionStrategy strategy, WorkerPoolConfig const& config);
    inline ~WorkerPool();
    WorkerPool(WorkerPool const&) = delete;
    WorkerPool& operator=(WorkerPool const&) = delete;
    WorkerPool(WorkerPool&&) = delete;
    WorkerPool& operator=(WorkerPool&&) = delete;

    inline uint16_t start() override;
    inline void     stop(bool wait) override;

    // todo jack: put it in the inl file
    // See `TDistributionStrategy` for threading guarantees.
    inline void addJob(gsl::owner<IExecutor*> job) override
    {
        auto jobAdded = m_strategy.distributeWork(m_workers.asSpan(), job);
        if (!jobAdded)
        {
            // handle backpressure by throttling the producer... not pretty but will "work"...
            Debug::verboseLog("job overflow, running synchronously...");
            job->run();
            delete job;
        }
    }

    bool isReady() const override;
    bool isAnyWorkerRunning() const override;
    /**
     * @remark "Safe" from any thread, in that the behavior is defined. For the answer to be correct (i.e. resolves in a
     * stable way, false remains false and true + sufficient time -> false) all producers first must be stopped.
     * @remark If a single thread is used as a producer, a false return from that thread is guaranteed correct.
     * @return true if any worker has a job.
     */
    inline bool hasPendingWork() const override;
    inline void setBatchReadyPoint() override;
    inline bool isBatchDone() override;

  private:
    ResizableArray<gsl::owner<WorkerLoop<PoolWorkerConfig>*>, uint16_t> m_workers;
    TDistributionStrategy                                               m_strategy;
};

/**
 * @remark not thread safe
 */
class RoundRobin : public IDistributionStrategy
{
  public:
    inline void configure(WorkerPoolConfig const& config) override;
    inline bool distributeWork(std::span<WorkerLoop<PoolWorkerConfig>*> o_workers, gsl::owner<IExecutor*> job) override;

  private:
    uint16_t m_index{0};
};

struct IWorkerPoolJobFactory
{
    virtual ~IWorkerPoolJobFactory() = default;
    virtual gsl::owner<IExecutor*> createJob() = 0;
};

void setWorkerPoolFactory(IWorkerPoolJobFactory* factory);

class NoopJobFactory : public IWorkerPoolJobFactory
{
  public:
    gsl::owner<IExecutor*> createJob() override
    {
        class NoopJob : public IExecutor
        {
          public:
            void run() override
            {
                // do nothing, intentionally
            }
        };

        return new (std::nothrow) NoopJob;
    }

    static NoopJobFactory sINSTANCE;
};

} // namespace JsUtil

#include "WorkerPool.inl"