#pragma once

#include "JsUtil/Threading.hpp"
#include "JsUtil/WorkerLoop.hpp"
#include <memory>

namespace JsUtil
{
/**
 * @remark Only thread safe in for single producer consumer pair.
 */
class WorkerPoolTaskConfig : public IWorkerLoopConfig
{
  public:
    inline explicit WorkerPoolTaskConfig(uint16_t jobQueueSize = 32);
    inline WorkerPoolTaskConfig(WorkerPoolTaskConfig&& other) noexcept;
    inline WorkerPoolTaskConfig& operator=(WorkerPoolTaskConfig&& other) noexcept;
    WorkerPoolTaskConfig(WorkerPoolTaskConfig& other) = delete;
    WorkerPoolTaskConfig& operator=(WorkerPoolTaskConfig& other) = delete;

    /**
     * @return True if there's no job possibility of an invalidated job running.
     * @remark Thread safe from the producer thread.
     */
    bool isWorkerSynced() const noexcept
    {
        std::unique_lock lock(m_state_mutex);
        return m_jobs.getAbsoluteStart() >= m_invalidateToIndex;
    }
    bool hasPendingWork() const noexcept
    {
        std::unique_lock lock(m_state_mutex);
        return !m_jobs.getIsEmpty();
    }
    bool addJob(std::shared_ptr<IExecutor> job)
    {
        std::unique_lock lock(m_state_mutex);
        return m_jobs.push(std::move(job));
    }
    inline void setJobQueueSize(uint16_t jobQueueSize);
    void        setBatchEndPoint() noexcept
    {
        std::unique_lock lock(m_state_mutex);
        m_batchEndIndex = m_jobs.getAbsoluteEnd();
    };
    bool isBatchDone()
    {
        std::unique_lock lock(m_state_mutex);
        return m_jobs.getAbsoluteStart() >= m_batchEndIndex;
    };
    void invalidateBatch() noexcept
    {
        std::unique_lock lock(m_state_mutex);
        m_invalidateToIndex = m_batchEndIndex;
    }
    bool isAcceptingWork() const noexcept
    {
        std::unique_lock lock(m_state_mutex);
        return m_acceptingWork;
    }

  public: // from IWorkerLoopConfig
    void onRegistered(JsUtil::INotifiable*) override {}

    void        onReady() override { m_acceptingWork = true; }
    inline void onTick() override;
    void        onComplete() override { m_acceptingWork = false; }

  private:
    mutable std::mutex m_state_mutex; // locks all state below
    CircularFIFOStack<std::shared_ptr<IExecutor>, ECircularStackOverflowMode::NoOp, uint16_t> m_jobs;
    uint64_t                                                                                  m_batchEndIndex = 0;
    bool                                                                                      m_acceptingWork = false;
    uint64_t                                                                                  m_invalidateToIndex = 0;
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
    virtual bool distributeWork(
        std::span<std::unique_ptr<WorkerLoop<WorkerPoolTaskConfig>>> o_workers,
        std::shared_ptr<IExecutor>                                   job
    ) noexcept = 0;
};

template <typename T>
concept WithDistributionStrategy = std::is_base_of_v<IDistributionStrategy, T>;

struct IWorkerPool
{
    // override
    virtual ~IWorkerPool() = default;
    virtual uint16_t start() = 0;
    virtual void     stop(bool wait) noexcept = 0;

    /**
     * @return true if the job was distributed to a worker, false if it ran synchronously.
     */
    virtual bool addJob(std::shared_ptr<IExecutor> job) noexcept = 0;
    virtual bool hasPendingWork() const noexcept = 0;
    virtual bool isAcceptingJobs() const noexcept = 0;
    virtual bool isAnyWorkerRunning() const noexcept = 0;

    virtual void setBatchEndPoint() noexcept = 0;
    virtual bool isBatchDone() const noexcept = 0;
    virtual void invalidateBatch() noexcept = 0;
    virtual bool areAllWorkersSynced() const noexcept = 0;
};

/**
 * @remark TDistributionStrategy sets the thread safety of `addJob`. Other methods are NOT thread safe (unless marked).
 */
template <WithDistributionStrategy TDistributionStrategy = IDistributionStrategy>
class WorkerPool final : public IWorkerPool
{
  public:
    ~WorkerPool() override;

    WorkerPool(TDistributionStrategy strategy, WorkerPoolConfig const& config);
    WorkerPool(WorkerPool const&) = delete;
    WorkerPool(WorkerPool&&) = delete;

    WorkerPool& operator=(WorkerPool const&) = delete;
    WorkerPool& operator=(WorkerPool&&) = delete;

    inline uint16_t start() override;
    inline void     stop(bool wait) noexcept override;

    // See `TDistributionStrategy` for threading guarantees.
    inline bool addJob(std::shared_ptr<IExecutor> job) noexcept override;

    bool isAcceptingJobs() const noexcept override;
    bool isAnyWorkerRunning() const noexcept override;
    /**
     * @remark "Safe" from any thread, in that the behavior is defined. For the answer to be correct (i.e. resolves in a
     * stable way, false remains and true + sufficient time -> false) all producers first must be stopped.
     * @remark If a single thread is used as a producer, a false return from that thread is guaranteed correct.
     * @return true if any worker has a job.
     */
    inline bool hasPendingWork() const noexcept override;
    inline void setBatchEndPoint() noexcept override;
    inline bool isBatchDone() const noexcept override;
    /// Only thread safe from the producer thread, you must set the batch first.
    void invalidateBatch() noexcept override;
    bool areAllWorkersSynced() const noexcept override;

  private:
    ResizableArray<std::unique_ptr<WorkerLoop<WorkerPoolTaskConfig>>, uint16_t> m_workers;
    TDistributionStrategy                                                       m_strategy;
    bool                                                                        m_syncOverflowHandling;
};

/**
 * @brief Passes the job to a single worker, giving a job to each in sequence, then "going around again".
 * @remark Not thread safe.
 */
class RoundRobin : public IDistributionStrategy
{
  public:
    inline void configure(WorkerPoolConfig const& config) override;
    inline bool distributeWork(
        std::span<std::unique_ptr<WorkerLoop<WorkerPoolTaskConfig>>> o_workers,
        std::shared_ptr<IExecutor>                                   job
    ) noexcept override;

  private:
    uint16_t m_index{0};
};

/**
 * @brief Passes each job to every worker.
 * @remark Not thread safe.
 */
class PassToAll : public IDistributionStrategy
{
  public:
    inline void configure(WorkerPoolConfig const& config) override;
    inline bool distributeWork(
        std::span<std::unique_ptr<WorkerLoop<WorkerPoolTaskConfig>>> o_workers,
        std::shared_ptr<IExecutor>                                   job
    ) noexcept override;
};

} // namespace JsUtil

#include "JsUtil/WorkerPool.inl"
