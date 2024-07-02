#include "JsUtil/WorkerPool.h"
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
    gsl::owner<JsUtil::IWorkerPool*> workerPool_createRoundRobin(uint16_t workerCount, uint16_t queueSize)
    {
        using namespace JsUtil;

        return new (std::nothrow) WorkerPool(
            RoundRobin{},
            WorkerPoolConfig{
                .workerCount = workerCount,
                .jobCount = queueSize,
            }
        );
    }

    EMSCRIPTEN_KEEPALIVE
    void workerPool_setBatchReadyPoint(JsUtil::IWorkerPool* o_pool)
    {
        o_pool->setBatchReadyPoint();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_isBatchDone(JsUtil::IWorkerPool* o_pool)
    {
        return o_pool->isBatchDone();
    }

    EMSCRIPTEN_KEEPALIVE
    void workerPool_addJob(JsUtil::IWorkerPool* o_pool, gsl::owner<JsUtil::IExecutor*> job)
    {
        o_pool->addJob(job);
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_isAnyWorkerRunning(JsUtil::IWorkerPool* pool)
    {
        return pool->isAnyWorkerRunning();
    }

    EMSCRIPTEN_KEEPALIVE
    bool workerPool_isReady(JsUtil::IWorkerPool* pool)
    {
        return pool->isReady();
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
}