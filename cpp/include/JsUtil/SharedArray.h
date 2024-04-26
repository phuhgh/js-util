#pragma once

#include "Debug.h"
#include <emscripten/em_macros.h>
#include <span>

namespace JsUtil
{
template <typename T> class SharedArray
{
  public:
    static SharedArray *CreateOne(size_t _size, bool clearMemory);
    std::span<T> const &GetArray() const;
    ~SharedArray();

  private:
    explicit SharedArray(T *_arrayStart, size_t _size);
    // disallow copy construction & assignment
    SharedArray &operator=(SharedArray const &) = delete;
    SharedArray(SharedArray const &) = delete;
    std::span<T> m_view;
};
} // namespace JsUtil

extern "C"
{
    // float 32
    EMSCRIPTEN_KEEPALIVE
    JsUtil::SharedArray<float> *f32SharedArray_createOne(size_t size, bool clearMemory);

    EMSCRIPTEN_KEEPALIVE
    float const *f32SharedArray_getArrayAddress(JsUtil::SharedArray<float> *sharedArray);

    EMSCRIPTEN_KEEPALIVE
    void f32SharedArray_delete(JsUtil::SharedArray<float> *sharedArray);

    // float 64
    EMSCRIPTEN_KEEPALIVE
    JsUtil::SharedArray<double> *f64SharedArray_createOne(size_t size, bool clearMemory);

    EMSCRIPTEN_KEEPALIVE
    double const *f64SharedArray_getArrayAddress(JsUtil::SharedArray<double> *sharedArray);

    EMSCRIPTEN_KEEPALIVE
    void f64SharedArray_delete(JsUtil::SharedArray<double> *sharedArray);
};