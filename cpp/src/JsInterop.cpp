#include "JsUtil/JsInterop.hpp"
#include <array>
#include <emscripten/em_js.h>
#include <emscripten/em_macros.h>

// ideally we'd just use val.h, but it seems like the way linking flags are supplied would be a pain downstream...
// very simple interop covers a lot of cases, so provide some very basic bindings that play nice with our build system
EM_JS(unsigned, jsu_removeBinder, (unsigned index), { Module.JSU_BINDER.removeBinder(index); });
EM_JS(unsigned, jsu_binderCb, (unsigned index), { Module.JSU_BINDER.getBinder(index)(); });

namespace JsInterop
{

void JsCallback::callback()
{
    jsu_binderCb(m_index);
}
JsCallback::~JsCallback()
{
    jsu_removeBinder(m_index);
}

JsUtil::HashMap<std::string_view, std::uint16_t>& IdRegistry::getIds()
{
    static JsUtil::HashMap<std::string_view, std::uint16_t> ids{};
    return ids;
}

} // namespace JsInterop

static constexpr auto sBINDING_COUNT{32};
// this is going to get written from JS
static std::array<JsInterop::InteropDescriptorBinding volatile, sBINDING_COUNT> sBINDING_GUIDES{};

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void jsUtilDeleteObject(gsl::owner<std::shared_ptr<JsInterop::ASharedMemoryObject>*> objPtr) noexcept
    {
        delete objPtr;
    }

    EMSCRIPTEN_KEEPALIVE
    JsInterop::ASharedMemoryObject* jsUtilUnwrapObject(
        gsl::owner<std::shared_ptr<JsInterop::ASharedMemoryObject>*> objPtr
    ) noexcept
    {
        return objPtr->get();
    }

    EMSCRIPTEN_KEEPALIVE
    void volatile* jsUtilGetRuntimeMappingAddress()
    {
        return sBINDING_GUIDES.data();
    }

    EMSCRIPTEN_KEEPALIVE
    void jsUtilRemoveRuntimeMappings(unsigned count, JsInterop::ASharedMemoryObject* o_sharedObj)
    {
        if constexpr (JsUtil::Debug::isDebug())
        {
            // UB already happened, no runtime check possible
            JsUtil::Debug::debugAssert(count < ::sBINDING_GUIDES.size(), "exceeded maximum binding size");
        }

        while (count > 0)
        {
            --count; // we want a zero based index
            o_sharedObj->removeSpecialization(
                JsInterop::InteropDescriptorBinding{
                    .categoryId = ::sBINDING_GUIDES[count].categoryId,
                    .specializationId = ::sBINDING_GUIDES[count].specializationId
                }
            );
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void jsUtilAddRuntimeMappings(unsigned count, JsInterop::ASharedMemoryObject* o_sharedObj)
    {
        if constexpr (JsUtil::Debug::isDebug())
        {
            // UB already happened, no runtime check possible
            JsUtil::Debug::debugAssert(count < ::sBINDING_GUIDES.size(), "exceeded maximum binding size");
        }

        while (count > 0)
        {
            --count; // we want a zero based index
            o_sharedObj->addSpecialization(
                JsInterop::InteropDescriptorBinding{
                    .categoryId = ::sBINDING_GUIDES[count].categoryId,
                    .specializationId = ::sBINDING_GUIDES[count].specializationId
                }
            );
        }
    }

    EMSCRIPTEN_KEEPALIVE
    bool jsUtilHasRuntimeMappingId(
        JsInterop::ASharedMemoryObject const* sharedObj,
        JsUtil::TInteropId                    catId,
        JsUtil::TInteropId                    specId
    )
    {
        auto const* c_spec = sharedObj->m_descriptors.find(catId);
        return c_spec == nullptr ? false : *c_spec == specId;
    }

    EMSCRIPTEN_KEEPALIVE
    JsUtil::TInteropId jsUtilGetRuntimeMappingId(char const* name)
    {
        return JsInterop::IdRegistry::getId(name);
    }
}
