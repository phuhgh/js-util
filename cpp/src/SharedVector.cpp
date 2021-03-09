#include "../include/SharedVector.h"

template<typename T>
SharedVector<T>::SharedVector(size_t _size) : m_vec(_size, 0)
{
}

template<typename T>
std::vector<T> const &SharedVector<T>::Get() const
{
    return m_vec;
}

// generic impl
template<typename T>
size_t sharedVector_getSize(SharedVector<T> *vec)
{
    if (!vec)
    {
        return 0;
    }

    return vec->Get().size();
}

template<typename T>
T const *sharedVector_getArrayAddress(SharedVector<T> *vec)
{
    if (!vec)
    {
        return nullptr;
    }

    return vec->Get().data();
}

// float 32 impl
SharedVector<float> *f32SharedVector_createOne(size_t size)
{
    return new SharedVector<float>(size);
}

float const *f32SharedVector_getArrayAddress(SharedVector<float> *vec)
{
    return sharedVector_getArrayAddress(vec);
}

size_t f32SharedVector_getSize(SharedVector<float> *vec)
{
    return sharedVector_getSize(vec);
}

void f32SharedVector_delete(SharedVector<float> *vec)
{
    delete vec;
}

// float 64 impl
SharedVector<double> *f64SharedVector_createOne(size_t size)
{
    return new SharedVector<double>(size);
}

double const *f64SharedVector_getArrayAddress(SharedVector<double> *vec)
{
    return sharedVector_getArrayAddress(vec);
}

size_t f64SharedVector_getSize(SharedVector<double> *vec)
{
    return sharedVector_getSize(vec);
}

void f64SharedVector_delete(SharedVector<double> *vec)
{
    delete vec;
}
