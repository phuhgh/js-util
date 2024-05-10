#include "JsUtil/Debug.h"

#include <cassert>
#include <emscripten/em_js.h>
#include <emscripten/em_macros.h>
#include <iostream>

EM_JS(void, DebugImpl_impl_onAllocate, (), { Module.RC_JS_MEMORY_DEBUG_UTIL.onAllocate.emit(); });

EM_JS(void, DebugImpl_error, (char const* _message), { Module.RC_JS_MEMORY_DEBUG_UTIL.error(UTF8ToString(_message)); });

EM_JS(void, DebugImpl_log, (char const* _message), {
    Module.RC_JS_MEMORY_DEBUG_UTIL.verboseLog(UTF8ToString(_message));
});

namespace JsUtil
{
bool Debug::sJS_INTEGRATION = true;

void Impl::Debug_onAllocate()
{
#ifndef JSU_NO_JS_DEBUG
    if (Debug::hasJsIntegration())
    {
        DebugImpl_impl_onAllocate();
    }
#endif
}
void Impl::Debug_error(char const* _message)
{
    if (Debug::hasJsIntegration())
    {
        DebugImpl_error(_message);
    }
    else
    {
        Debug_log(_message);
        assert(false);
    }
}
void Impl::Debug_log(char const* _message)
{
    if (Debug::hasJsIntegration())
    {
        DebugImpl_log(_message);
    }
    else
    {
        std::cout << _message << "\n";
    }
}
} // namespace JsUtil
