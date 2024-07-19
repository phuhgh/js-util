#pragma once

#include "JsUtil/TypeTraits.h"

namespace JsUtil
{

namespace Impl
{
void Debug_onAllocate();
void Debug_error(char const* _message);
void Debug_log(char const* _message);
} // namespace Impl

class Debug
{
  public:
    constexpr static bool isDebug()
    {
#ifndef NDEBUG
        return true;
#else
        return false;
#endif
    }

    static bool hasJsIntegration() { return sJS_INTEGRATION; }
    static void disableJsIntegration() { sJS_INTEGRATION = false; };
    static void setDebugDisabled(bool disabled) { sDEBUG_DISABLED = disabled; }
    static bool isDebugDisabled() { return sDEBUG_DISABLED; }

    static void onBeforeAllocate()
    {
#ifndef NDEBUG
        Impl::Debug_onAllocate();
#endif
    }

#ifndef NDEBUG
    static void error(char const* _message) { Impl::Debug_error(_message); }
#else
    static void error(char const*) {}
#endif

#ifndef NDEBUG
    // using just "assert" gets clobbered by assert with annoying regularity
    static void debugAssert(bool _condition, char const* _message)
    {
        if (!_condition)
        {
            Impl::Debug_error(_message);
        }
    }
#else
    static void debugAssert(bool, char const*) {}
#endif

#ifndef NDEBUG
    static void verboseLog(char const* _message) { Impl::Debug_log(_message); }
#else
    static void verboseLog(char const*) {}
#endif

#ifndef NDEBUG
    template <IsVoidCallback TCallback>
    static void runBlock(TCallback _callback)
    {
        _callback();
    }
#else
    template <IsVoidCallback TCallback>
    static void runBlock(TCallback)
    {
    }
#endif

  private:
    static bool sJS_INTEGRATION;
    static bool sDEBUG_DISABLED;
};

} // namespace JsUtil