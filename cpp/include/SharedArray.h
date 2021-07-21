#pragma once

#include <span>
#include <emscripten.h>
#include "Debug.h"

namespace JsUtil
{
    template<typename T>
    class SharedArray
    {
    public:
        static SharedArray *CreateOne(size_t _size, bool clearMemory);
        std::span<T> const &GetArray() const;
        ~SharedArray();

    private:
        explicit SharedArray(T *_arrayStart, size_t _size);
        std::span<T> m_view;
    };
}

extern "C"
{
// float 32
EMSCRIPTEN_KEEPALIVE JsUtil::SharedArray<float> *f32SharedArray_createOne(size_t size, bool clearMemory);

EMSCRIPTEN_KEEPALIVE float const *f32SharedArray_getArrayAddress(JsUtil::SharedArray<float> *sharedArray);

EMSCRIPTEN_KEEPALIVE void f32SharedArray_delete(JsUtil::SharedArray<float> *sharedArray);

// float 64
EMSCRIPTEN_KEEPALIVE JsUtil::SharedArray<double> *f64SharedArray_createOne(size_t size);

EMSCRIPTEN_KEEPALIVE double const *f64SharedArray_getArrayAddress(JsUtil::SharedArray<double> *sharedArray, bool clearMemory);

EMSCRIPTEN_KEEPALIVE void f64SharedArray_delete(JsUtil::SharedArray<double> *sharedArray);
};