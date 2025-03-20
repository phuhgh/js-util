#include "FakeWorkerConfig.h"
#include "JsUtil/WorkerPool.hpp"
#include "JsUtilTestUtil/CreateDestroyTestCounter.hpp"
#include <emscripten/bind.h>

namespace JsUtil
{

inline constexpr IdCategory<struct CatFlag, void> scTEST_CAT_FLAG{"TEST_CAT_FLAG"};

class TestExecutor : public IExecutor
{
  public:
    TestExecutor(bool goSlow)
        : m_goSlow(goSlow)
    {
    }
    // from IExecutor
    void run() noexcept override
    {
        if (m_goSlow)
        {
            std::this_thread::sleep_for(std::chrono::milliseconds(20));
        }
        ++sTICK_COUNT;
    }

    static std::atomic<unsigned> sTICK_COUNT;
    bool                         m_goSlow{false};
};
std::atomic<unsigned> TestExecutor::sTICK_COUNT{0};

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
uint32_t fakeWorkerJob_createJob(bool goSlow)
{
    return (uint32_t)new (std::nothrow) JsUtil::TestExecutor(goSlow);
}

void setTestCategoryFlag()
{
    auto jsIntegration = JsUtil::Debug::hasJsIntegration();
    JsUtil::Debug::disableJsIntegration();
    LangExt::ScopeGuard const guard{[jsIntegration] {
        // this will run before the javascript is available, and well before anything downstream could get
        // messed up by a resize, so this check is redundant...
        JsUtil::Debug::disableJsIntegration(!jsIntegration);
    }};

    JsInterop::IdRegistry::registerIdentifiers(std::make_tuple(JsUtil::scTEST_CAT_FLAG));
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
    emscripten::function("fakeWorkerJob_createJob", &fakeWorkerJob_createJob, emscripten::allow_raw_pointers());
    emscripten::function("setTestCategoryFlag", &setTestCategoryFlag);
}
