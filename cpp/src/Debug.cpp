#include "Debug.h"

EM_JS(void, Debug_onAllocate, (), {
    RcJsUtilDebug.onAllocate.emit();
});

EM_JS(void, Debug_error, (char const *message), {
    RcJsUtilDebug.error(UTF8ToString(message));
});

void JsUtil::Debug::OnBeforeAllocate()
{
#ifdef DEBUG_MODE
    Debug_onAllocate();
#endif
}

void JsUtil::Debug::Error(char const * message)
{
#ifdef DEBUG_MODE
    Debug_error(message);
#endif
}