#include "JsUtil/Debug.hpp"
#include "JsUtil/JsInterop.hpp"
#include <cstdint>
#include <cstdlib>
#include <emscripten/em_macros.h>

// purely for javascript, these are never referenced from c++
extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void jsUtilEndProgram(int _statusCode)
    {
#ifndef NDEBUG
        JsUtil::Debug::verboseLog("exiting program...");
#endif
        std::exit(_statusCode);
    }

    // emscripten provides malloc / free but these may be elided without setting them required in compiler args
    // downstream
    EMSCRIPTEN_KEEPALIVE
    void* jsUtilMalloc(std::uint32_t _size)
    {
        return malloc(_size);
    }

    EMSCRIPTEN_KEEPALIVE
    void* jsUtilCalloc(std::uint32_t _sizeToAllocate, std::uint32_t _sizeOfElement)
    {
        return calloc(_sizeToAllocate, _sizeOfElement);
    }

    EMSCRIPTEN_KEEPALIVE
    void jsUtilFree(void* ptr)
    {
        free(ptr);
    }

    EMSCRIPTEN_KEEPALIVE
    void jsUtilDeleteObject(JsInterop::ISharedMemoryObject* ptr)
    {
        delete ptr;
    }

    EMSCRIPTEN_KEEPALIVE
    bool isDebugBuild(void)
    {
#ifdef NDEBUG
        return false;
#else
        return true;
#endif
    }
}
