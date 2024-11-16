#pragma once

#include "JsUtil/TypeTraits.hpp"
#include <format>
#include <string_view>

namespace JsUtil
{

namespace Impl
{
void Debug_onAllocate();
void Debug_error(std::string_view _message);
void Debug_log(std::string_view _message);
} // namespace Impl

class Debug
{
  public:
    /**
     * If you want to be extra sure ALL debug code is removed, you can constexpr if on this (99.99% placebo)...
     * @return True if it's a debug build.
     */
    [[nodiscard]] constexpr static bool isDebug() noexcept
    {
#ifndef NDEBUG
        return true;
#else
        return false;
#endif
    }

    static bool hasJsIntegration() { return sJS_INTEGRATION; }
    static void disableJsIntegration(bool disable = true) { sJS_INTEGRATION = !disable; };
    static void setDebugDisabled(bool disabled) { sDEBUG_DISABLED = disabled; }
    static bool isDebugDisabled() { return sDEBUG_DISABLED; }

    static void onBeforeAllocate() noexcept
    {
        if constexpr (isDebug())
        {
            Impl::Debug_onAllocate();
        }
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
    static void verboseLog(std::string_view _message) { Impl::Debug_log(_message); }
#else
    static void verboseLog(char const*) {}
#endif

#ifndef NDEBUG
    template <WithCallable<void> TCallback>
    static void runBlock(TCallback _callback)
    {
        _callback();
    }
#else
    template <WithCallable<void> TCallback>
    static void runBlock(TCallback)
    {
    }
#endif

  private:
    static bool sJS_INTEGRATION;
    static bool sDEBUG_DISABLED;
};

} // namespace JsUtil
