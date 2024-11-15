#include "JsUtil/SharedArray.hpp"
#include "JsUtil/Debug.hpp"
#include "JsUtil/JsInterop.hpp"
#include "JsUtil/RTTI.hpp"
#include <emscripten/em_macros.h>

gsl::owner<JsInterop::ISharedMemoryObject*> createOneDynamic(
    RTTI::ENumberIdentifier numberId,
    size_t                  size,
    bool                    clearMemory
)
{
    using namespace JsUtil;
    using namespace JsInterop;

    if constexpr (Debug::isDebug())
    {
        Debug::onBeforeAllocate();
    }

    switch (numberId)
    {
    case RTTI::ENumberIdentifier::U8:
        return new (std::nothrow) SharedMemoryValue{SharedArray<uint8_t>::createOne(size, clearMemory)};
    case RTTI::ENumberIdentifier::U16:
        return new (std::nothrow) SharedMemoryValue{SharedArray<uint16_t>::createOne(size, clearMemory)};
    case RTTI::ENumberIdentifier::U32:
        return new (std::nothrow) SharedMemoryValue{SharedArray<uint32_t>::createOne(size, clearMemory)};
    case RTTI::ENumberIdentifier::U64:
        return new (std::nothrow) SharedMemoryValue{SharedArray<uint64_t>::createOne(size, clearMemory)};
    case RTTI::ENumberIdentifier::I8:
        return new (std::nothrow) SharedMemoryValue{SharedArray<int8_t>::createOne(size, clearMemory)};
    case RTTI::ENumberIdentifier::I16:
        return new (std::nothrow) SharedMemoryValue{SharedArray<int16_t>::createOne(size, clearMemory)};
    case RTTI::ENumberIdentifier::I32:
        return new (std::nothrow) SharedMemoryValue{SharedArray<int32_t>::createOne(size, clearMemory)};
    case RTTI::ENumberIdentifier::I64:
        return new (std::nothrow) SharedMemoryValue{SharedArray<int64_t>::createOne(size, clearMemory)};
    case RTTI::ENumberIdentifier::F32:
        return new (std::nothrow) SharedMemoryValue{SharedArray<float>::createOne(size, clearMemory)};
    case RTTI::ENumberIdentifier::F64:
        return new (std::nothrow) SharedMemoryValue{SharedArray<double>::createOne(size, clearMemory)};
    default:
        return nullptr;
    }
}

void* getOffset(RTTI::ENumberIdentifier numberId, JsInterop::ISharedMemoryObject const* sharedObject)
{
    using namespace JsUtil;
    using namespace JsInterop;
    switch (numberId)
    {
    case RTTI::ENumberIdentifier::U8:
        return static_cast<SharedArray<uint8_t>*>(sharedObject->m_valuePtr)->asSpan().data();
    case RTTI::ENumberIdentifier::U16:
        return static_cast<SharedArray<uint16_t>*>(sharedObject->m_valuePtr)->asSpan().data();
    case RTTI::ENumberIdentifier::U32:
        return static_cast<SharedArray<uint32_t>*>(sharedObject->m_valuePtr)->asSpan().data();
    case RTTI::ENumberIdentifier::U64:
        return static_cast<SharedArray<uint64_t>*>(sharedObject->m_valuePtr)->asSpan().data();
    case RTTI::ENumberIdentifier::I8:
        return static_cast<SharedArray<int8_t>*>(sharedObject->m_valuePtr)->asSpan().data();
    case RTTI::ENumberIdentifier::I16:
        return static_cast<SharedArray<int16_t>*>(sharedObject->m_valuePtr)->asSpan().data();
    case RTTI::ENumberIdentifier::I32:
        return static_cast<SharedArray<int32_t>*>(sharedObject->m_valuePtr)->asSpan().data();
    case RTTI::ENumberIdentifier::I64:
        return static_cast<SharedArray<int64_t>*>(sharedObject->m_valuePtr)->asSpan().data();
    case RTTI::ENumberIdentifier::F32:
        return static_cast<SharedArray<float>*>(sharedObject->m_valuePtr)->asSpan().data();
    case RTTI::ENumberIdentifier::F64:
        return static_cast<SharedArray<double>*>(sharedObject->m_valuePtr)->asSpan().data();
    default:
        return nullptr;
    }
}

extern "C"
{
    [[maybe_unused]] EMSCRIPTEN_KEEPALIVE void* sharedArray_getArrayAddress(
        RTTI::ENumberIdentifier const         numberId,
        JsInterop::ISharedMemoryObject const* sharedArray
    )
    {
        if (sharedArray == nullptr)
        {
            if constexpr (JsUtil::Debug::isDebug())
            {
                JsUtil::Debug::error("expected shared array, got null ptr");
            }
            return nullptr;
        }

        return getOffset(numberId, sharedArray);
    }

    [[maybe_unused]] EMSCRIPTEN_KEEPALIVE gsl::owner<JsInterop::ISharedMemoryObject*> sharedArray_createOne(
        RTTI::ENumberIdentifier const numberId,
        size_t const                  size,
        bool const                    clearMemory
    )
    {
        gsl::owner<JsInterop::ISharedMemoryObject*> sharedArray = createOneDynamic(numberId, size, clearMemory);
        if (sharedArray != nullptr)
        {
            if (sharedArray_getArrayAddress(numberId, sharedArray) == nullptr)
            {
                // we failed to allocate the memory
                delete sharedArray;
                return nullptr;
            }
        }
        return sharedArray;
    }
}
