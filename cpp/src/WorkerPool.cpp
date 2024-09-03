#include "JsUtil/WorkerPool.hpp"
#include <emscripten/em_macros.h>

namespace JsUtil
{

NoopJobFactory         NoopJobFactory::sINSTANCE;
IWorkerPoolJobFactory* sWORKER_POOL_JOB_FACTORY = &NoopJobFactory::sINSTANCE;

void setWorkerPoolFactory(IWorkerPoolJobFactory* factory)
{
    Debug::debugAssert(factory != nullptr, "expected a factory, got nullptr...");
    sWORKER_POOL_JOB_FACTORY = factory;
}

} // namespace JsUtil

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    gsl::owner<JsUtil::IWorkerPool*> workerPool_createRoundRobin(
        uint16_t workerCount,
        uint16_t queueSize,
        bool     syncOverflowHandling
    )
    {
        using namespace JsUtil;

        return new (std::nothrow) WorkerPool(
            RoundRobin{},
            WorkerPoolConfig{
                .workerCount = workerCount,
                .jobCount = queueSize,
                .syncOverflowHandling = syncOverflowHandling,
            }
        );
    }

    EMSCRIPTEN_KEEPALIVE
    void workerPool_setBatchEndPoint(JsUtil::IWorkerPool* o_pool)
    {
        o_pool->setBatchEndPoint();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_isBatchDone(JsUtil::IWorkerPool* o_pool)
    {
        return o_pool->isBatchDone();
    }

    EMSCRIPTEN_KEEPALIVE
    void workerPool_invalidateBatch(JsUtil::IWorkerPool* pool)
    {
        pool->invalidateBatch();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_areWorkersSynced(JsUtil::IWorkerPool* pool)
    {
        return pool->areAllWorkersSynced();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_addJob(JsUtil::IWorkerPool* o_pool, gsl::owner<JsUtil::IExecutor*> job)
    {
        return o_pool->addJob(job);
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_isAnyWorkerRunning(JsUtil::IWorkerPool* pool)
    {
        return pool->isAnyWorkerRunning();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_isAcceptingJobs(JsUtil::IWorkerPool* pool)
    {
        return pool->isAcceptingJobs();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_hasPendingWork(JsUtil::IWorkerPool* pool)
    {
        return pool->hasPendingWork();
    }

    EMSCRIPTEN_KEEPALIVE
    unsigned workerPool_start(JsUtil::IWorkerPool* o_pool)
    {
        return o_pool->start();
    }

    EMSCRIPTEN_KEEPALIVE
    void workerPool_stop(JsUtil::IWorkerPool* o_pool, bool wait)
    {
        o_pool->stop(wait);
    }

    EMSCRIPTEN_KEEPALIVE
    gsl::owner<JsUtil::IExecutor*> workerPool_createJob()
    {
        return JsUtil::sWORKER_POOL_JOB_FACTORY->createJob();
    }

    EMSCRIPTEN_KEEPALIVE
    void workerPool_deleteJob(gsl::owner<JsUtil::IExecutor*> job)
    {
        delete job;
    }
}