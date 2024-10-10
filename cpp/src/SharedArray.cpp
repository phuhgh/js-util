#include "JsUtil/SharedArray.hpp"
#include <emscripten/em_macros.h>

// todo jack: this needs re-reviewing...
namespace JsUtil
{

template <typename T>
T const* sharedArray_getArrayAddress(SharedArray<T>* sharedArray)
{
    if (!sharedArray)
    {
        if constexpr (Debug::isDebug())
        {
            Debug::error("expected shared array, got null ptr");
        }
        return nullptr;
    }

    return sharedArray->asSpan().data();
}

} // namespace JsUtil

extern "C"
{
    // float 32 impl
    [[maybe_unused]]
    EMSCRIPTEN_KEEPALIVE JsUtil::SharedArray<float>* f32SharedArray_createOne(size_t size, bool clearMemory)
    {
        return JsUtil::SharedArray<float>::createOne(size, clearMemory);
    }

    [[maybe_unused]]
    EMSCRIPTEN_KEEPALIVE float const* f32SharedArray_getArrayAddress(JsUtil::SharedArray<float>* sharedArray)
    {
        return sharedArray_getArrayAddress(sharedArray);
    }

    [[maybe_unused]]
    EMSCRIPTEN_KEEPALIVE void f32SharedArray_destroy(JsUtil::SharedArray<float>* sharedArray)
    {
        delete sharedArray;
    }

    // float 64 impl
    [[maybe_unused]]
    EMSCRIPTEN_KEEPALIVE JsUtil::SharedArray<double>* f64SharedArray_createOne(size_t size, bool clearMemory)
    {
        return JsUtil::SharedArray<double>::createOne(size, clearMemory);
    }

    [[maybe_unused]]
    EMSCRIPTEN_KEEPALIVE double const* f64SharedArray_getArrayAddress(JsUtil::SharedArray<double>* sharedArray)
    {
        return sharedArray_getArrayAddress(sharedArray);
    }

    [[maybe_unused]]
    EMSCRIPTEN_KEEPALIVE void f64SharedArray_destroy(JsUtil::SharedArray<double>* sharedArray)
    {
        delete sharedArray;
    }
}