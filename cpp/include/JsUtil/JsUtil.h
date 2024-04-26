#pragma once

#include "Debug.h"
#include <cstdint>
#include <cstdlib>
#include <emscripten/bind.h>
#include <emscripten/em_macros.h>

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void jsUtilEndProgram(int _statusCode)
    {
#ifndef NDEBUG
        JsUtil::Debug::VerboseLog("exiting program...");
        std::exit(_statusCode);
#endif
    }

    // emscripten provides malloc / free but these may be elided without setting them required in compiler args
    // downstream
    EMSCRIPTEN_KEEPALIVE
    void *jsUtilMalloc(std::uint32_t _size)
    {
        return malloc(_size);
    }

    EMSCRIPTEN_KEEPALIVE
    void *jsUtilCalloc(std::uint32_t _sizeToAllocate, std::uint32_t _sizeOfElement)
    {
        return calloc(_sizeToAllocate, _sizeOfElement);
    }

    EMSCRIPTEN_KEEPALIVE
    void jsUtilFree(void *ptr)
    {
        free(ptr);
    }
}