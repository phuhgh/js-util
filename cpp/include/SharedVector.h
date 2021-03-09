#pragma once

#include <vector>
#include "target_export.h"
#include "emscripten.h"

template<typename T>
class TARGET_EXPORT SharedVector
{
public:
    explicit SharedVector(size_t _size);

    std::vector<T> const &Get() const;

private:
    std::vector<T> m_vec;
};

extern "C"
{
// float 32
EMSCRIPTEN_KEEPALIVE SharedVector<float> *f32SharedVector_createOne(size_t size);

EMSCRIPTEN_KEEPALIVE float const *f32SharedVector_getArrayAddress(SharedVector<float> *vec);

EMSCRIPTEN_KEEPALIVE size_t f32SharedVector_getSize(SharedVector<float> *vec);

EMSCRIPTEN_KEEPALIVE void f32SharedVector_delete(SharedVector<float> *vec);

// float 64
EMSCRIPTEN_KEEPALIVE SharedVector<double> *f64SharedVector_createOne(size_t size);

EMSCRIPTEN_KEEPALIVE double const *f64SharedVector_getArrayAddress(SharedVector<double> *vec);

EMSCRIPTEN_KEEPALIVE size_t f64SharedVector_getSize(SharedVector<double> *vec);

EMSCRIPTEN_KEEPALIVE void f64SharedVector_delete(SharedVector<double> *vec);
};