#include "JsUtil/Debug.hpp"
#include <cassert>
#include <emscripten/em_js.h>
#include <emscripten/em_macros.h>
#include <emscripten/threading.h>

EM_JS(void, jsu_dbgOnAlloc, (), { Module.JSU_DEBUG_UTIL.onAllocate.emit(); });

EM_JS(void, jsu_dbgErr, (char const* message), { Module.JSU_DEBUG_UTIL.error(UTF8ToString(message)); });

// clang-format off
EM_JS(void, jsu_dbgLog, (char const* message, char const* const* tagsPtr, int tagCount), {
    const tags = new Array(tagCount);
    const tagOffset = tagsPtr >> 2;
    for (let i = 0; i < tagCount; ++i)
    {
        const tagPtr = HEAP32[tagOffset + i];
        tags[i] = UTF8ToString(tagPtr);
    }
    Module.JSU_DEBUG_UTIL.verboseLog(tags, UTF8ToString(message));
});
// clang-format on

namespace JsUtil
{
bool Debug::sJS_INTEGRATION = true;
bool Debug::sDEBUG_DISABLED = false;

void Impl::Debug_onAllocate()
{
    if (Debug::isDebugDisabled() || !Debug::hasJsIntegration())
    {
        return;
    }
    jsu_dbgOnAlloc();
}
void Impl::Debug_error(std::string_view _message)
{
    if (Debug::isDebugDisabled())
    {
        return;
    }

    if (Debug::hasJsIntegration() && static_cast<bool>(emscripten_is_main_runtime_thread()))
    {
        jsu_dbgErr(_message.data());
    }
    else
    {
        Debug_log(_message, {});
        assert(false);
    }
}
void Impl::Debug_log(std::string_view _message, std::span<char const* const> tags)
{
    if (Debug::isDebugDisabled())
    {
        return;
    }

    if (Debug::hasJsIntegration() && static_cast<bool>(emscripten_is_main_runtime_thread()))
    {
        jsu_dbgLog(_message.data(), tags.data(), tags.size());
    }
    else
    {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdollar-in-identifier-extension"
        EM_ASM({ console.log(UTF8ToString($0)); }, _message.data());
#pragma clang diagnostic pop
    }
}

} // namespace JsUtil
