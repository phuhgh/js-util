#pragma once

#include <cstdlib>
#include <cstdint>
#include <emscripten/em_macros.h>
#include <emscripten/bind.h>
#include "Debug.h"

extern "C"
{
EMSCRIPTEN_KEEPALIVE
void jsUtilEndProgram(int _statusCode)
{
#ifdef DEBUG_MODE
    JsUtil::Debug::VerboseLog("exiting program...");
    std::exit(_statusCode);
#endif
}

// emscripten provides malloc / free but these may be elided without setting them required in compiler args downstream
EMSCRIPTEN_KEEPALIVE
void * jsUtilMalloc(std::uint32_t _size)
{
    return malloc(_size);
}

EMSCRIPTEN_KEEPALIVE
void * jsUtilCalloc(std::uint32_t _sizeToAllocate, std::uint32_t _sizeOfElement)
{
    return calloc(_sizeToAllocate, _sizeOfElement);
}

EMSCRIPTEN_KEEPALIVE
void jsUtilFree(void * ptr)
{
    free(ptr);
}
}