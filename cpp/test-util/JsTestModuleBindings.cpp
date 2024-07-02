#include "FakeWorkerConfig.h"
#include "JsUtil/WorkerPool.h"
#include "JsUtilTestUtil/CreateDestroyTestCounter.h"
#include <emscripten/bind.h>
#include <emscripten/val.h>

namespace JsUtil
{

class TestExecutor : public IExecutor
{
  public:
    // from IExecutor
    void run() override { ++m_tick_count; }

    static std::atomic<unsigned> m_tick_count;
};
std::atomic<unsigned> TestExecutor::m_tick_count{0};

class TestWorkerFactory : public IWorkerPoolJobFactory
{
  public:
    gsl::owner<IExecutor*> createJob() override { return new (std::nothrow) TestExecutor; }

    static TestWorkerFactory sINSTANCE;
};
TestWorkerFactory TestWorkerFactory::sINSTANCE;

} // namespace JsUtil

using TrackedExecutor = CreateDestroyTestCounter<JsUtil::TestExecutor>;

void fakeWorkerJob_resetCounts()
{
    TrackedExecutor::m_tick_count = 0;
    TrackedExecutor::reset();
}
unsigned fakeWorkerJob_getCreateCount()
{
    return TrackedExecutor::getTotalConstructedCount();
}
unsigned fakeWorkerJob_getTickCount()
{
    return TrackedExecutor::m_tick_count;
}
unsigned fakeWorkerJob_getDestroyCount()
{
    return TrackedExecutor::m_destroyed.load();
}
void fakeWorkerJob_setJobFactory()
{
    JsUtil::setWorkerPoolFactory(&JsUtil::TestWorkerFactory::sINSTANCE);
}

EMSCRIPTEN_BINDINGS(clazz)
{
    emscripten::class_<JsUtil::TestExecutor>("TestExecutor");
}

EMSCRIPTEN_BINDINGS(jsUtil)
{
    emscripten::function("fakeWorkerJob_resetCounts", &fakeWorkerJob_resetCounts);
    emscripten::function("fakeWorkerJob_getCreateCount", &fakeWorkerJob_getCreateCount);
    emscripten::function("fakeWorkerJob_getTickCount", &fakeWorkerJob_getTickCount);
    emscripten::function("fakeWorkerJob_getDestroyCount", &fakeWorkerJob_getDestroyCount);
    emscripten::function("fakeWorkerJob_setJobFactory", &fakeWorkerJob_setJobFactory, emscripten::allow_raw_pointers());
}
