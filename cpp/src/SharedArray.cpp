#include "SharedArray.h"

template<typename T>
JsUtil::SharedArray<T>::SharedArray(T *_arrayStart, size_t _size)
        : m_view(_arrayStart, _size)
{
}

template<typename T>
JsUtil::SharedArray<T> *JsUtil::SharedArray<T>::CreateOne(size_t _size, bool clearMemory)
{
    JsUtil::Debug::OnBeforeAllocate();
    T *arrayPtr = clearMemory
                  ? static_cast<T *> (calloc(_size, sizeof(T)))
                  : static_cast<T *> (malloc(_size * sizeof(T)));

    if (arrayPtr == nullptr)
    {
        // allocation failed
        return nullptr;
    }

    return new SharedArray<T>(arrayPtr, _size);
}

template<typename T>
std::span<T> const &JsUtil::SharedArray<T>::GetArray() const
{
    return m_view;
}

template<typename T>
JsUtil::SharedArray<T>::~SharedArray()
{
    free(m_view.data());
}

// generic impl
template<typename T>
T const *sharedArray_getArrayAddress(JsUtil::SharedArray<T> *sharedArray)
{
    if (!sharedArray)
    {
        JsUtil::Debug::Error("expected shared array, got null ptr");
        return nullptr;
    }

    return sharedArray->GetArray()
                      .data();
}

// float 32 impl
JsUtil::SharedArray<float> *f32SharedArray_createOne(size_t size, bool clearMemory)
{
    return JsUtil::SharedArray<float>::CreateOne(size, clearMemory);
}

float const *f32SharedArray_getArrayAddress(JsUtil::SharedArray<float> *sharedArray)
{
    return sharedArray_getArrayAddress(sharedArray);
}

void f32SharedArray_delete(JsUtil::SharedArray<float> *sharedArray)
{
    delete sharedArray;
}

// float 64 impl
JsUtil::SharedArray<double> *f64SharedArray_createOne(size_t size, bool clearMemory)
{
    return JsUtil::SharedArray<double>::CreateOne(size, clearMemory);
}

double const *f64SharedArray_getArrayAddress(JsUtil::SharedArray<double> *sharedArray)
{
    return sharedArray_getArrayAddress(sharedArray);
}

void f64SharedArray_delete(JsUtil::SharedArray<double> *sharedArray)
{
    delete sharedArray;
}
