#include "FakeWorkerConfig.h"
#include "JsUtil/WorkerPool.hpp"
#include "JsUtilTestUtil/CreateDestroyTestCounter.hpp"

#include <JsUtil/SegmentedDataView.hpp>
#include <JsUtil/Vec2.hpp>
#include <emscripten/bind.h>

namespace JsUtil
{

inline constexpr IdCategory<struct CatFlag, void> scTEST_CAT_FLAG{"TEST_CAT_FLAG", true};

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

uint32_t testVector_readWriteU16Vec2(uint32_t maybeVec2)
{
    auto* vec2 = (JsUtil::Vec2<uint16_t>*)maybeVec2;
    if (vec2 == nullptr)
    {
        return -1;
    }
    // it's impractical to test every combination, but they're all generated the same way, so it should "Just work"TM
    auto prev = vec2->x() + vec2->y();
    vec2->setX(101);
    vec2->setY(102);
    return prev;
}

std::uint32_t testSegmentedDataView_readWriteU16(std::uint32_t maybeData, std::uint32_t maybeDescriptor)
{
    auto* data = (JsUtil::ResizableArray<std::uint16_t>*)maybeData;
    auto* descriptor = (JsUtil::SegmentedDataViewOptions*)maybeDescriptor;
    auto  view = JsUtil::SegmentedDataView{*data, *descriptor};

    std::uint32_t sum{0};
    for (size_t i = 0; i < view.getLength(); ++i)
    {
        auto span = view.getBlock(i);
        for (auto value : span)
        {
            sum += value;
        }
    }

    return sum;
}

std::uint32_t testResizableArray_readWriteU16(std::uint32_t maybeData)
{
    auto*         data = (JsUtil::ResizableArray<std::uint16_t>*)maybeData;
    std::uint32_t sum{0};

    for (auto value : data->asSpan())
    {
        sum += value;
    }

    (*data)[0] = 101;

    return sum;
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
    emscripten::function("testVector_readWriteU16Vec2", &testVector_readWriteU16Vec2, emscripten::allow_raw_pointers());
    emscripten::function(
        "testSegmentedDataView_readWriteU16", &testSegmentedDataView_readWriteU16, emscripten::allow_raw_pointers()
    );
    emscripten::function(
        "testResizableArray_readWriteU16", &testResizableArray_readWriteU16, emscripten::allow_raw_pointers()
    );
}
