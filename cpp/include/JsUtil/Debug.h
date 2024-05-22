#pragma once

#include <functional>
#include <type_traits>

namespace JsUtil
{

namespace Impl
{
void Debug_onAllocate();
void Debug_error(char const* _message);
void Debug_log(char const* _message);
} // namespace Impl

template <typename T>
concept DebugCallback = std::invocable<T> && std::is_void_v<std::invoke_result_t<T>>;

class Debug
{
  public:
    static bool hasJsIntegration() { return sJS_INTEGRATION; };
    static void disableJsIntegration() { sJS_INTEGRATION = false; };

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
    static void assert(bool _condition, char const* _message)
    {
        if (!_condition)
        {
            Impl::Debug_error(_message);
        }
    }
#else
    static void assert(bool, char const*) {}
#endif

#ifndef NDEBUG
    static void verboseLog(char const* _message) { Impl::Debug_log(_message); }
#else
    static void verboseLog(char const*) {}
#endif

#ifndef NDEBUG
    template <DebugCallback TCallback> static void runBlock(TCallback _callback) { _callback(); }
#else
    template <DebugCallback TCallback> static void runBlock(TCallback) {}
#endif

  private:
    static bool sJS_INTEGRATION;
};

} // namespace JsUtil