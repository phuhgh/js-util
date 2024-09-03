#include "JsUtil/Debug.hpp"
#include <cassert>
#include <emscripten/em_js.h>
#include <emscripten/em_macros.h>
#include <emscripten/threading.h>
#include <iostream>

EM_JS(void, jsu_dbgOnAlloc, (), { Module.JSU_DEBUG_UTIL.onAllocate.emit(); });

EM_JS(void, jsu_dbgErr, (char const* message), { Module.JSU_DEBUG_UTIL.error(UTF8ToString(message)); });

EM_JS(void, jsu_dbgLog, (char const* message), { Module.JSU_DEBUG_UTIL.verboseLog(UTF8ToString(message)); });

namespace JsUtil
{
bool Debug::sJS_INTEGRATION = true;
bool Debug::sDEBUG_DISABLED = false;

void Impl::Debug_onAllocate()
{
#ifndef JSU_NO_JS_DEBUG
    if (Debug::isDebugDisabled())
    {
        return;
    }

    if (Debug::hasJsIntegration())
    {
        jsu_dbgOnAlloc();
    }
#endif
}
void Impl::Debug_error(char const* _message)
{
    if (Debug::isDebugDisabled())
    {
        return;
    }

    if (Debug::hasJsIntegration() && static_cast<bool>(emscripten_is_main_runtime_thread()))
    {
        jsu_dbgErr(_message);
    }
    else
    {
        Debug_log(_message);
        assert(false);
    }
}
void Impl::Debug_log(char const* _message)
{
    if (Debug::isDebugDisabled())
    {
        return;
    }

    if (Debug::hasJsIntegration() && static_cast<bool>(emscripten_is_main_runtime_thread()))
    {
        jsu_dbgLog(_message);
    }
    else
    {
        // todo jack: this is blocking! definitely switch to console.log if possible
        std::cout << _message << "\n";
    }
}
} // namespace JsUtil
