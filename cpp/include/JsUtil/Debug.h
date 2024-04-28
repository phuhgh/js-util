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
    static void error(char const* _message)
    {
#ifndef NDEBUG
        Impl::Debug_error(_message);
#endif
    }
    static void assert(bool _condition, char const* _message)
    {
#ifndef NDEBUG
        if (!_condition)
        {
            Impl::Debug_error(_message);
        }
#endif
    }
    static void verboseLog(char const* _message)
    {
#ifndef NDEBUG
        Impl::Debug_log(_message);
#endif
    }
    static void runBlock(T_RunBlock* _callback)
    {
#ifndef NDEBUG
        (*_callback)();
#endif
    }
};

} // namespace JsUtil