#pragma once

#include "JsUtil/Identifiers.hpp"

namespace JsRTTI
{

enum class ENumberIdentifier : uint32_t
{
    U8 = 0, // used for indexing
    U16,
    U32,
    U64,
    I8,
    I16,
    I32,
    I64,
    F32,
    F64,
};

// ReSharper disable once CppNotAllPathsReturnValue
template <typename T>
constexpr ENumberIdentifier getNumberIdFromType()
{
    if constexpr (std::is_same_v<T, uint8_t>)
    {
        return ENumberIdentifier::U8;
    }
    if constexpr (std::is_same_v<T, uint16_t>)
    {
        return ENumberIdentifier::U16;
    }
    if constexpr (std::is_same_v<T, uint32_t>)
    {
        return ENumberIdentifier::U32;
    }
    if constexpr (std::is_same_v<T, uint64_t>)
    {
        return ENumberIdentifier::U64;
    }
    if constexpr (std::is_same_v<T, int8_t>)
    {
        return ENumberIdentifier::I8;
    }
    if constexpr (std::is_same_v<T, int16_t>)
    {
        return ENumberIdentifier::I16;
    }
    if constexpr (std::is_same_v<T, int32_t>)
    {
        return ENumberIdentifier::I32;
    }
    if constexpr (std::is_same_v<T, int64_t>)
    {
        return ENumberIdentifier::I64;
    }
    if constexpr (std::is_same_v<T, float>)
    {
        return ENumberIdentifier::F32;
    }
    if constexpr (std::is_same_v<T, double>)
    {
        return ENumberIdentifier::F64;
    }

    // lack of return is a good thing, it shouldn't compile for unknown types...
}

/**
 * Data which can be interpreted through `SegmentedDataView` (must be contiguous).
 */
inline constexpr JsUtil::IdCategory<struct BufferCategory, void> scBUFFER_CATEGORY{"JSU_BUFFER"};
inline constexpr JsUtil::IdCategory<struct NumberCategory, void> scNUMBER_CATEGORY{"JSU_NUMBER"};

inline constexpr auto scSHARED_ARRAY = JsUtil::createSpecialization<void>(scBUFFER_CATEGORY, "JSU_SHARED_ARRAY");
inline constexpr auto scRESIZABLE_ARRAY = JsUtil::createSpecialization<void>(scBUFFER_CATEGORY, "JSU_RESIZABLE_ARRAY");

inline constexpr auto scU8 = JsUtil::createSpecialization<uint8_t>(scNUMBER_CATEGORY, "JSU_U8");
inline constexpr auto scU16 = JsUtil::createSpecialization<uint16_t>(scNUMBER_CATEGORY, "JSU_U16");
inline constexpr auto scU32 = JsUtil::createSpecialization<uint32_t>(scNUMBER_CATEGORY, "JSU_U32");
inline constexpr auto scU64 = JsUtil::createSpecialization<uint64_t>(scNUMBER_CATEGORY, "JSU_U64");
inline constexpr auto scI8 = JsUtil::createSpecialization<int8_t>(scNUMBER_CATEGORY, "JSU_I8");
inline constexpr auto scI16 = JsUtil::createSpecialization<int16_t>(scNUMBER_CATEGORY, "JSU_I16");
inline constexpr auto scI32 = JsUtil::createSpecialization<int32_t>(scNUMBER_CATEGORY, "JSU_I32");
inline constexpr auto scI64 = JsUtil::createSpecialization<int64_t>(scNUMBER_CATEGORY, "JSU_I64");
inline constexpr auto scF32 = JsUtil::createSpecialization<float>(scNUMBER_CATEGORY, "JSU_F32");
inline constexpr auto scF64 = JsUtil::createSpecialization<double>(scNUMBER_CATEGORY, "JSU_F64");

using NumberKinds = std::tuple<uint8_t, uint16_t, uint32_t, uint64_t, int8_t, int16_t, int32_t, int64_t, float, double>;

inline constexpr auto scNUMBER_KINDS =
    std::make_tuple(scU8, scU16, scU32, scU64, scI8, scI16, scI32, scI64, scF32, scF64);

enum class EVectorIdentifier : uint32_t
{
    Vec2 = 0, // used for indexing
    Vec3,
    Vec4,
    Mat2,
    Mat3,
    Mat4,
    Range2d,
};

} // namespace JsRTTI
