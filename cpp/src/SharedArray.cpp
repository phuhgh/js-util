#include "JsUtil/SharedArray.h"
#include <emscripten/em_macros.h>

namespace JsUtil
{

template <typename T> SharedArray<T>* SharedArray<T>::createOne(size_t _size, bool _clearMemory)
{
    Debug::onBeforeAllocate();
    T* arrayPtr = _clearMemory ? static_cast<T*>(calloc(_size, sizeof(T))) : static_cast<T*>(malloc(_size * sizeof(T)));

    if (arrayPtr == nullptr)
    {
        // allocation failed
        return nullptr;
    }

    auto shared_array = new SharedArray<T>(arrayPtr, _size);

    if (shared_array == nullptr)
    {
        free(arrayPtr);
        return nullptr;
    }

    return shared_array;
}

template <typename T> T const* sharedArray_getArrayAddress(SharedArray<T>* sharedArray)
{
    if (!sharedArray)
    {
        Debug::error("expected shared array, got null ptr");
        return nullptr;
    }

    return sharedArray->getArray().data();
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
    EMSCRIPTEN_KEEPALIVE void f32SharedArray_delete(JsUtil::SharedArray<float>* sharedArray)
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
    EMSCRIPTEN_KEEPALIVE void f64SharedArray_delete(JsUtil::SharedArray<double>* sharedArray)
    {
        delete sharedArray;
    }
}