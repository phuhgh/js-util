#include "JsUtil/Debug.h"
#include <emscripten/em_js.h>
#include <emscripten/em_macros.h>

EM_JS(void, DebugImpl_impl_onAllocate, (), { Module.RC_JS_MEMORY_DEBUG_UTIL.onAllocate.emit(); });

EM_JS(void, DebugImpl_error, (char const* _message), { Module.RC_JS_MEMORY_DEBUG_UTIL.error(UTF8ToString(_message)); });

EM_JS(void, DebugImpl_log, (char const* _message), {
    Module.RC_JS_MEMORY_DEBUG_UTIL.verboseLog(UTF8ToString(_message));
});

namespace JsUtil::Impl
{
void Debug_onAllocate()
{
    DebugImpl_impl_onAllocate();
}
void Debug_error(char const* _message)
{
    DebugImpl_error(_message);
}
void Debug_log(char const* _message)
{
    DebugImpl_log(_message);
}
} // namespace JsUtil::Impl
