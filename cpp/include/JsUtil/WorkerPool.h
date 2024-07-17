#pragma once

#include "JsUtil/Threading.h"
#include "JsUtil/WorkerLoop.h"
#include <gsl/pointers>

// todo jack: replace unsigned with uint64 (all), might overflow in some long running cases
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

    /**
     * @return True if there's no job possibility of an invalidated job running.
     * @remark Thread safe from the producer thread.
     */
    bool        isWorkerSynced() const { return m_invalidateToIndex == 0 || m_jobs.getIsEmpty(); }
    bool        hasPendingWork() const { return !m_jobs.getIsEmpty(); }
    bool        addJob(gsl::owner<IExecutor*> job) { return m_jobs.push(std::move(job)); }
    inline void setJobQueueSize(uint16_t jobQueueSize);
    void        setBatchEndPoint() { m_batchEndIndex = m_jobs.getAbsoluteEnd(); };
    bool        isBatchDone() { return m_jobs.getAbsoluteStart() >= m_batchEndIndex; };
    void        invalidateBatch() { m_invalidateToIndex = m_batchEndIndex.load(); }
    bool        isAcceptingWork() const { return m_acceptingWork; }

  public: // from IWorkerLoopConfig
    void        onRegistered(JsUtil::INotifiable*) override {}
    void        onReady() override { m_acceptingWork = true; }
    inline void onTick() override;
    void        onComplete() override { m_acceptingWork = false; }

  private:
    CircularFIFOStack<gsl::owner<IExecutor*>, ECircularStackOverflowMode::NoOp, uint16_t, std::atomic<uint16_t>> m_jobs;
    std::atomic<unsigned> m_batchEndIndex = 0;
    std::atomic<bool>     m_acceptingWork = false;
    std::atomic<unsigned> m_invalidateToIndex = 0;
};

struct WorkerPoolConfig
{
    uint16_t workerCount{4};
    uint16_t jobCount{32};
    bool     syncOverflowHandling{true};
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

    /**
     * @return true if the job was distributed to a worker, false if it ran synchronously.
     */
    virtual bool addJob(gsl::owner<IExecutor*> job) = 0;
    virtual bool hasPendingWork() const = 0;
    virtual bool isAcceptingJobs() const = 0;
    virtual bool isAnyWorkerRunning() const = 0;

    virtual void setBatchEndPoint() = 0;
    virtual bool isBatchDone() const = 0;
    virtual void invalidateBatch() = 0;
    virtual bool areAllWorkersSynced() const = 0;
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

    // See `TDistributionStrategy` for threading guarantees.
    inline bool addJob(gsl::owner<IExecutor*> job) override;

    bool isAcceptingJobs() const override;
    bool isAnyWorkerRunning() const override;
    /**
     * @remark "Safe" from any thread, in that the behavior is defined. For the answer to be correct (i.e. resolves in a
     * stable way, false remains false and true + sufficient time -> false) all producers first must be stopped.
     * @remark If a single thread is used as a producer, a false return from that thread is guaranteed correct.
     * @return true if any worker has a job.
     */
    inline bool hasPendingWork() const override;
    inline void setBatchEndPoint() override;
    inline bool isBatchDone() const override;
    /// Only thread safe from the producer thread, you must set the batch first.
    void invalidateBatch() override;
    bool areAllWorkersSynced() const override;

  private:
    ResizableArray<gsl::owner<WorkerLoop<PoolWorkerConfig>*>, uint16_t> m_workers;
    TDistributionStrategy                                               m_strategy;
    bool                                                                m_syncOverflowHandling;
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
            void run() override {}
        };

        return new (std::nothrow) NoopJob;
    }

    static NoopJobFactory sINSTANCE;
};

} // namespace JsUtil

#include "WorkerPool.inl"