#pragma once

#include <emscripten/em_macros.h>
#include <emscripten/em_js.h>

namespace JsUtil
{
    class Debug
    {
    public:
        static void OnBeforeAllocate();
        static void Error(char const * message);
        static void VerboseLog(char const * message);
    };
}