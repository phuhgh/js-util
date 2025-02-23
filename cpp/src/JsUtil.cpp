#include "JsUtil/JsUtil.hpp"
#include "JsUtil/Debug.hpp"
#include "JsUtil/FunctionFactory.hpp"
#include "JsUtil/JsInterop.hpp"
#include <JsUtil/RTTI.hpp>
#include <cstdint>
#include <cstdlib>
#include <emscripten/em_macros.h>

void JsUtil::initializeJsu()
{
    auto jsIntegration = JsUtil::Debug::hasJsIntegration();
    Debug::disableJsIntegration();
    LangExt::ScopeGuard const guard{[jsIntegration] {
        // this will run before the javascript is available, and well before anything downstream could get
        // messed up by a resize, so this check is redundant...
        Debug::disableJsIntegration(!jsIntegration);
    }};

    JsInterop::IdRegistry::registerIdentifiers(
        std::make_tuple(
            JsRTTI::scBUFFER_CATEGORY, JsRTTI::scNUMBER_CATEGORY, JsRTTI::scSHARED_ARRAY, JsRTTI::scRESIZABLE_ARRAY
        )
    );

    JsInterop::IdRegistry::registerIdentifiers(
        std::make_tuple(
            Autogen::scFUNCTION_FACTORY_CATEGORY,
            Autogen::scITERATOR_SPECIALIZATION
        )
    );

    JsInterop::IdRegistry::registerIdentifiers(
        std::make_tuple(
            JsRTTI::scU8,
            JsRTTI::scU16,
            JsRTTI::scU32,
            JsRTTI::scU64,
            JsRTTI::scI8,
            JsRTTI::scI16,
            JsRTTI::scI32,
            JsRTTI::scI64,
            JsRTTI::scF32,
            JsRTTI::scF64
        )
    );
}

// purely for javascript, these are never referenced from c++
extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void jsUtilEndProgram(int _statusCode)
    {
        if constexpr (JsUtil::Debug::isDebug())
        {
            JsUtil::Debug::verboseLog("exiting program...");
        }

        std::exit(_statusCode);
    }

    // emscripten provides malloc / free but these may be elided without setting them required in compiler args
    // downstream
    EMSCRIPTEN_KEEPALIVE
    void* jsUtilMalloc(std::uint32_t _size) noexcept
    {
        return malloc(_size);
    }

    EMSCRIPTEN_KEEPALIVE
    void* jsUtilCalloc(std::uint32_t _sizeToAllocate, std::uint32_t _sizeOfElement) noexcept
    {
        return calloc(_sizeToAllocate, _sizeOfElement);
    }

    EMSCRIPTEN_KEEPALIVE
    void jsUtilFree(void* ptr) noexcept
    {
        free(ptr);
    }

    EMSCRIPTEN_KEEPALIVE
    bool isDebugBuild(void) noexcept
    {
        return JsUtil::Debug::isDebug();
    }

    EMSCRIPTEN_KEEPALIVE
    void jsuInitializeSelf()
    {
        JsUtil::initializeJsu();
    }
}
