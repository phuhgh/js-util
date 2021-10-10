#include "Debug.h"

EM_JS(void, Debug_onAllocate, (), {
    RcJsUtilDebug.onAllocate.emit();
});

EM_JS(void, Debug_error, (char const *_message), {
    RcJsUtilDebug.error(UTF8ToString(_message));
});

EM_JS(void, Debug_log, (char const *_message), {
    RcJsUtilDebug.verboseLog(UTF8ToString(_message));
});

void JsUtil::Debug::OnBeforeAllocate()
{
#ifdef DEBUG_MODE
    Debug_onAllocate();
#endif
}

void JsUtil::Debug::Error(char const * _message)
{
#ifdef DEBUG_MODE
    Debug_error(_message);
#endif
}

void JsUtil::Debug::Assert(bool condition, char const * _message)
{
#ifdef DEBUG_MODE
    if (!condition)
    {
        Debug_error(_message);
    }
#endif
}

void JsUtil::Debug::VerboseLog(const char * _message)
{
#ifdef DEBUG_MODE
    Debug_log(_message);
#endif
}

void JsUtil::Debug::RunBlock(T_RunBlock * _callback)
{
#ifdef DEBUG_MODE
    (*_callback)();
#endif
}