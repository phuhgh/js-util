#include "JsUtil/Debug.hpp"
#include <cassert>
#include <emscripten/em_js.h>
#include <emscripten/em_macros.h>
#include <emscripten/threading.h>

EM_JS(void, jsu_dbgOnAlloc, (), { Module.JSU_DEBUG_UTIL.onAllocate.emit(); });

EM_JS(void, jsu_dbgErr, (char const* message), { Module.JSU_DEBUG_UTIL.error(UTF8ToString(message)); });

EM_JS(void, jsu_dbgLog, (char const* message), { Module.JSU_DEBUG_UTIL.verboseLog(UTF8ToString(message)); });

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
        Debug_log(_message);
        assert(false);
    }
}
void Impl::Debug_log(std::string_view _message)
{
    if (Debug::isDebugDisabled())
    {
        return;
    }

    if (Debug::hasJsIntegration() && static_cast<bool>(emscripten_is_main_runtime_thread()))
    {
        jsu_dbgLog(_message.data());
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
