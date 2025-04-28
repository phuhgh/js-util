#include "JsUtil/Debug.hpp"
#include "JsUtil/Mat2.hpp"
#include "JsUtil/Mat3.hpp"
#include "JsUtil/Mat4.hpp"
#include "JsUtil/RTTI.hpp"
#include "JsUtil/Tuple.hpp"
#include "JsUtil/Vec2.hpp"
#include "JsUtil/Vec3.hpp"
#include "JsUtil/Vec4.hpp"

#include <JsUtil/Range2d.hpp>
#include <emscripten/em_macros.h>
#include <gsl/pointers>

auto const vectorFactories = TupleExt::map(JsRTTI::NumberKinds{}, []<typename TStorage>(TStorage) {
    return [](JsRTTI::EVectorIdentifier id) -> gsl::owner<void*> {
        switch (id)
        {
        case JsRTTI::EVectorIdentifier::Vec2:
            return new (std::nothrow) JsUtil::Vec2<TStorage>{};
        case JsRTTI::EVectorIdentifier::Vec3:
            return new (std::nothrow) JsUtil::Vec3<TStorage>{};
        case JsRTTI::EVectorIdentifier::Vec4:
            return new (std::nothrow) JsUtil::Vec4<TStorage>{};
        case JsRTTI::EVectorIdentifier::Mat2:
            return new (std::nothrow) JsUtil::Mat2<TStorage>{};
        case JsRTTI::EVectorIdentifier::Mat3:
            return new (std::nothrow) JsUtil::Mat3<TStorage>{};
        case JsRTTI::EVectorIdentifier::Mat4:
            return new (std::nothrow) JsUtil::Mat4<TStorage>{};
        case JsRTTI::EVectorIdentifier::Range2d:
            return new (std::nothrow) JsUtil::Range2d<TStorage>{};
        default:
            if constexpr (JsUtil::Debug::isDebug())
            {
                auto msg = "unexpected id: " + std::to_string(static_cast<unsigned>(id));
                JsUtil::Debug::error(msg.c_str());
            }

            return nullptr;
        }
    };
});

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    gsl::owner<void*> jsUtilCreateVec(
        JsRTTI::ENumberIdentifier const numberId,
        JsRTTI::EVectorIdentifier const vectorId
    ) noexcept
    {
        return TupleExt::select(vectorFactories, static_cast<size_t>(numberId))(vectorId);
    }
}