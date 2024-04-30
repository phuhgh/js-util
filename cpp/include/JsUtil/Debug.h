#pragma once

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
    typedef void(T_RunBlock)();
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
    static void runBlock(T_RunBlock* _callback) { (*_callback)(); }
#else
    static void runBlock(T_RunBlock*) {}
#endif
};

} // namespace JsUtil