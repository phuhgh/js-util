#include "JsUtil/Debug.h"

EM_JS(void, Debug_onAllocate, (), { Module.RC_JS_MEMORY_DEBUG_UTIL.onAllocate.emit(); });

EM_JS(void, Debug_error, (char const *_message), { Module.RC_JS_MEMORY_DEBUG_UTIL.error(UTF8ToString(_message)); });

EM_JS(void, Debug_log, (char const *_message), { Module.RC_JS_MEMORY_DEBUG_UTIL.verboseLog(UTF8ToString(_message)); });

namespace JsUtil
{
void Debug::OnBeforeAllocate()
{
#ifndef NDEBUG
    Debug_onAllocate();
#endif
}

void Debug::Error(char const *_message)
{
#ifndef NDEBUG
    Debug_error(_message);
#endif
}

void Debug::Assert(bool condition, char const *_message)
{
#ifndef NDEBUG
    if (!condition)
    {
        Debug_error(_message);
    }
#endif
}

void Debug::VerboseLog(char const *_message)
{
#ifndef NDEBUG
    Debug_log(_message);
#endif
}

void Debug::RunBlock(T_RunBlock *_callback)
{
#ifndef NDEBUG
    (*_callback)();
#endif
}
} // namespace JsUtil