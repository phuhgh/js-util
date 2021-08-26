#pragma once

#include <emscripten/em_macros.h>
#include <emscripten/em_js.h>
#include <cstdlib>

namespace JsUtil
{
    class Debug
    {
    public:
        static void OnBeforeAllocate();
        static void Error(char const * message);
    };
}

extern "C"
{
EMSCRIPTEN_KEEPALIVE
void endProgram(int statusCode);
}