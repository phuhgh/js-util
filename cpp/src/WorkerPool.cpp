#include "JsUtil/WorkerPool.hpp"
#include "JsUtil/JsInterop.hpp"
#include <emscripten/em_macros.h>

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    JsInterop::SharedMemoryOwnerPtr<JsUtil::IWorkerPool> workerPool_createRoundRobin(
        uint16_t workerCount,
        uint16_t queueSize,
        bool     syncOverflowHandling
    ) noexcept
    {
        using namespace JsUtil;
        using namespace JsInterop;

        if constexpr (Debug::isDebug())
        {
            Debug::onBeforeAllocate();
        }

        gsl::owner<IWorkerPool*> pool = new (std::nothrow) WorkerPool(
            RoundRobin{},
            WorkerPoolConfig{
                .workerCount = workerCount,
                .jobCount = queueSize,
                .syncOverflowHandling = syncOverflowHandling,
            }
        );

        return createSharedMemoryOwner(pool, createEmptyDescriptor());
    }

    EMSCRIPTEN_KEEPALIVE
    void workerPool_setBatchEndPoint(JsInterop::SharedMemoryOwner<JsUtil::IWorkerPool>* o_pool) noexcept
    {
        o_pool->m_owningPtr->setBatchEndPoint();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_isBatchDone(JsInterop::SharedMemoryOwner<JsUtil::IWorkerPool>* o_pool) noexcept
    {
        return o_pool->m_owningPtr->isBatchDone();
    }

    EMSCRIPTEN_KEEPALIVE
    void workerPool_invalidateBatch(JsInterop::SharedMemoryOwner<JsUtil::IWorkerPool>* o_pool) noexcept
    {
        o_pool->m_owningPtr->invalidateBatch();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_areWorkersSynced(JsInterop::SharedMemoryOwner<JsUtil::IWorkerPool>* o_pool) noexcept
    {
        return o_pool->m_owningPtr->areAllWorkersSynced();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_addJob(
        JsInterop::SharedMemoryOwner<JsUtil::IWorkerPool>* o_pool,
        gsl::owner<JsUtil::IExecutor*>                     job
    ) noexcept
    {
        return o_pool->m_owningPtr->addJob(job);
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_isAnyWorkerRunning(JsInterop::SharedMemoryOwner<JsUtil::IWorkerPool>* o_pool) noexcept
    {
        return o_pool->m_owningPtr->isAnyWorkerRunning();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_isAcceptingJobs(JsInterop::SharedMemoryOwner<JsUtil::IWorkerPool>* o_pool) noexcept
    {
        return o_pool->m_owningPtr->isAcceptingJobs();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_hasPendingWork(JsInterop::SharedMemoryOwner<JsUtil::IWorkerPool>* o_pool) noexcept
    {
        return o_pool->m_owningPtr->hasPendingWork();
    }

    // possible std::system_error, not a lot we can do about it...
    EMSCRIPTEN_KEEPALIVE
    unsigned workerPool_start(JsInterop::SharedMemoryOwner<JsUtil::IWorkerPool>* o_pool)
    {
        return o_pool->m_owningPtr->start();
    }

    EMSCRIPTEN_KEEPALIVE
    void workerPool_stop(JsInterop::SharedMemoryOwner<JsUtil::IWorkerPool>* o_pool, bool wait)
    {
        o_pool->m_owningPtr->stop(wait);
    }

    EMSCRIPTEN_KEEPALIVE
    void workerPool_deleteJob(gsl::owner<JsUtil::IExecutor*> job)
    {
        delete job;
    }
}