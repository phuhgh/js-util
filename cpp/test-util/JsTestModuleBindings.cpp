#include "FakeWorkerConfig.h"
#include "JsUtil/WorkerPool.hpp"
#include "JsUtilTestUtil/CreateDestroyTestCounter.hpp"
#include <emscripten/bind.h>
#include <emscripten/val.h>

namespace JsUtil
{

class TestExecutor : public IExecutor
{
  public:
    // from IExecutor
    void run() override
    {
        if (sGO_SLOW)
        {
            std::this_thread::sleep_for(std::chrono::milliseconds(20));
        }
        ++sTICK_COUNT;
    }

    static std::atomic<unsigned> sTICK_COUNT;
    static std::atomic<bool>     sGO_SLOW;
};
std::atomic<unsigned> TestExecutor::sTICK_COUNT{0};
std::atomic<bool>     TestExecutor::sGO_SLOW{false};

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
    TrackedExecutor::sTICK_COUNT = 0;
    TrackedExecutor::reset();
}
unsigned fakeWorkerJob_getCreateCount()
{
    return TrackedExecutor::getTotalConstructedCount();
}
unsigned fakeWorkerJob_getTickCount()
{
    return TrackedExecutor::sTICK_COUNT;
}
unsigned fakeWorkerJob_getDestroyCount()
{
    return TrackedExecutor::m_destroyed.load();
}
void fakeWorkerJob_setJobFactory(bool goSlow)
{
    JsUtil::setWorkerPoolFactory(&JsUtil::TestWorkerFactory::sINSTANCE);
    JsUtil::TestExecutor::sGO_SLOW = goSlow;
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
