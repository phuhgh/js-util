#pragma once

#include <emscripten/em_macros.h>
#include <emscripten/em_js.h>

namespace JsUtil
{
    class Debug
    {
    public:
        typedef void(T_RunBlock)();
        static void OnBeforeAllocate();
        static void Error(char const * _message);
        static void Assert(bool _condition, char const * _message);
        static void VerboseLog(char const * _message);
        static void RunBlock(T_RunBlock * _callback);
    };
}