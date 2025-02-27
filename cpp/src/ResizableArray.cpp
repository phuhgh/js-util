#include "JsUtil/ResizableArray.hpp"
#include "JsUtil/JsInterop.hpp"
#include "JsUtil/RTTI.hpp"
#include <emscripten/em_macros.h>

auto const offsets = TupleExt::map(JsRTTI::NumberKinds{}, []<typename T>(T) {
    return [](JsInterop::ASharedMemoryObject* sharedObject) -> void* {
        auto* array = static_cast<JsUtil::ResizableArray<T>*>(sharedObject->getValuePtr());
        return static_cast<void*>(array->asSpan().data());
    };
});

auto const setSizes = TupleExt::map(JsRTTI::NumberKinds{}, []<typename T>(T) {
    return [](JsInterop::ASharedMemoryObject* sharedObject, size_t newSize) -> bool {
        auto* array = static_cast<JsUtil::ResizableArray<T>*>(sharedObject->getValuePtr());
        return array->resize(newSize);
    };
});

auto const getSizes = TupleExt::map(JsRTTI::NumberKinds{}, []<typename T>(T) {
    return [](JsInterop::ASharedMemoryObject* sharedObject) -> size_t {
        auto* array = static_cast<JsUtil::ResizableArray<T>*>(sharedObject->getValuePtr());
        return array->size();
    };
});

auto const factories = TupleExt::map(JsRTTI::NumberKinds{}, []<typename T>(T) {
    return [](size_t size) -> gsl::owner<JsInterop::ASharedMemoryObject*> {
        auto bufferCategory = getCategoryId(JsRTTI::scBUFFER_CATEGORY);
        auto bufferSpecialization = getSpecializationId(JsRTTI::scRESIZABLE_ARRAY);

        auto           numberCategory = getCategoryId(JsRTTI::scNUMBER_CATEGORY);
        constexpr auto index = TupleExt::IndexOf<T, JsRTTI::NumberKinds>::value;
        auto           numberSpecialization = getSpecializationId(std::get<index>(JsRTTI::scNUMBER_KINDS));

        auto attributesMap = JsInterop::ASharedMemoryObject::TDescriptors({
            {bufferCategory, bufferSpecialization},
            {numberCategory, numberSpecialization},
        });

        if (attributesMap.empty())
        {
            return nullptr;
        }

        if constexpr (JsUtil::Debug::isDebug())
        {
            JsUtil::Debug::onBeforeAllocate();
        }

        return JsInterop::createSharedMemoryOwner(
            new (std::nothrow) JsUtil::ResizableArray<T>(size), std::move(attributesMap)
        );
    };
});

extern "C"
{
    [[maybe_unused]] EMSCRIPTEN_KEEPALIVE void* resizableArray_getDataAddress(
        JsRTTI::ENumberIdentifier const numberId,
        JsInterop::ASharedMemoryObject* resizableArray
    ) noexcept
    {
        if (resizableArray == nullptr)
        {
            if constexpr (JsUtil::Debug::isDebug())
            {
                JsUtil::Debug::error("expected shared array, got null ptr");
            }
            return nullptr;
        }

        return TupleExt::select(offsets, static_cast<size_t>(numberId))(resizableArray);
    }

    [[maybe_unused]] EMSCRIPTEN_KEEPALIVE bool resizableArray_setSize(
        JsRTTI::ENumberIdentifier const numberId,
        uint32_t                        newSize,
        JsInterop::ASharedMemoryObject* o_resizableArray
    ) noexcept
    {
        if (o_resizableArray == nullptr)
        {
            if constexpr (JsUtil::Debug::isDebug())
            {
                JsUtil::Debug::error("expected shared array, got null ptr");
            }
            return false;
        }

        return TupleExt::select(setSizes, static_cast<size_t>(numberId))(o_resizableArray, newSize);
    }

    [[maybe_unused]] EMSCRIPTEN_KEEPALIVE gsl::owner<JsInterop::ASharedMemoryObject*> resizableArray_createOne(
        JsRTTI::ENumberIdentifier const numberId,
        size_t const                    requestedSize
    ) noexcept
    {
        gsl::owner<JsInterop::ASharedMemoryObject*> resizableArray =
            TupleExt::select(factories, static_cast<size_t>(numberId))(requestedSize);

        if (resizableArray != nullptr)
        {
            auto actualSize = TupleExt::select(getSizes, static_cast<size_t>(numberId))(resizableArray);
            if (actualSize != requestedSize)
            {
                // we failed to allocate the memory
                delete resizableArray;
                return nullptr;
            }
        }

        return resizableArray;
    }
}
