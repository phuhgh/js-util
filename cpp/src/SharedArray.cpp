#include "JsUtil/SharedArray.hpp"
#include "JsUtil/Debug.hpp"
#include "JsUtil/JsInterop.hpp"
#include "JsUtil/RTTI.hpp"
#include "JsUtil/Tuple.hpp"
#include <emscripten/em_macros.h>

auto const offsets = TupleExt::map(JsRTTI::NumberKinds{}, []<typename T>(T) {
    return [](JsInterop::ASharedMemoryObject* sharedObject) -> void* {
        auto* array = static_cast<JsUtil::SharedArray<T>*>(sharedObject->getValuePtr());
        return static_cast<void*>(array->asSpan().data());
    };
});

auto const factories = TupleExt::map(JsRTTI::NumberKinds{}, []<typename T>(T) {
    return [](size_t size, bool clearMemory) -> gsl::owner<JsInterop::ASharedMemoryObject*> {
        auto bufferCategory = getCategoryId(JsRTTI::scBUFFER_CATEGORY);
        auto bufferSpecialization = getSpecializationId(JsRTTI::scSHARED_ARRAY);

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
            new (std::nothrow) JsUtil::SharedArray<T>(size, clearMemory), std::move(attributesMap)
        );
    };
});

extern "C"
{
    [[maybe_unused]] EMSCRIPTEN_KEEPALIVE void* sharedArray_getDataAddress(
        JsRTTI::ENumberIdentifier const numberId,
        JsInterop::ASharedMemoryObject* sharedArray
    ) noexcept
    {
        if (sharedArray == nullptr)
        {
            if constexpr (JsUtil::Debug::isDebug())
            {
                JsUtil::Debug::error("expected shared array, got null ptr");
            }
            return nullptr;
        }

        return TupleExt::select(offsets, static_cast<size_t>(numberId))(sharedArray);
    }

    [[maybe_unused]] EMSCRIPTEN_KEEPALIVE gsl::owner<JsInterop::ASharedMemoryObject*> sharedArray_createOne(
        JsRTTI::ENumberIdentifier const numberId,
        size_t const                    size,
        bool const                      clearMemory
    ) noexcept
    {
        gsl::owner<JsInterop::ASharedMemoryObject*> sharedArray =
            TupleExt::select(factories, static_cast<size_t>(numberId))(size, clearMemory);

        if (sharedArray != nullptr)
        {
            if (sharedArray_getDataAddress(numberId, sharedArray) == nullptr)
            {
                // we failed to allocate the memory
                delete sharedArray;
                return nullptr;
            }
        }

        return sharedArray;
    }
}
