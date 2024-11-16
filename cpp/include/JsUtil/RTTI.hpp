#pragma once

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
inline constexpr JsUtil::IdCategory<struct BufferCategory> scBUFFER_CATEGORY{"JSU_BUFFER"};
inline constexpr JsUtil::IdCategory<struct NumberCategory> scNUMBER_CATEGORY{"JSU_NUMBER"};

inline constexpr JsUtil::IdSpecialization<uint8_t, decltype(scBUFFER_CATEGORY)> scSHARED_ARRAY{
    scBUFFER_CATEGORY,
    "JSU_SHARED_ARRAY"
};
inline constexpr JsUtil::IdSpecialization<uint8_t, decltype(scBUFFER_CATEGORY)> scRESIZABLE_ARRAY{
    scBUFFER_CATEGORY,
    "JSU_RESIZABLE_ARRAY"
};

inline constexpr JsUtil::IdSpecialization<uint8_t, decltype(scNUMBER_CATEGORY)>  scU8{scNUMBER_CATEGORY, "JSU_U8"};
inline constexpr JsUtil::IdSpecialization<uint16_t, decltype(scNUMBER_CATEGORY)> scU16{scNUMBER_CATEGORY, "JSU_U16"};
inline constexpr JsUtil::IdSpecialization<uint32_t, decltype(scNUMBER_CATEGORY)> scU32{scNUMBER_CATEGORY, "JSU_U32"};
inline constexpr JsUtil::IdSpecialization<uint64_t, decltype(scNUMBER_CATEGORY)> scU64{scNUMBER_CATEGORY, "JSU_U64"};
inline constexpr JsUtil::IdSpecialization<int8_t, decltype(scNUMBER_CATEGORY)>   scI8{scNUMBER_CATEGORY, "JSU_I8"};
inline constexpr JsUtil::IdSpecialization<int16_t, decltype(scNUMBER_CATEGORY)>  scI16{scNUMBER_CATEGORY, "JSU_I16"};
inline constexpr JsUtil::IdSpecialization<int32_t, decltype(scNUMBER_CATEGORY)>  scI32{scNUMBER_CATEGORY, "JSU_I32"};
inline constexpr JsUtil::IdSpecialization<int64_t, decltype(scNUMBER_CATEGORY)>  scI64{scNUMBER_CATEGORY, "JSU_I64"};
inline constexpr JsUtil::IdSpecialization<float, decltype(scNUMBER_CATEGORY)>    scF32{scNUMBER_CATEGORY, "JSU_F32"};
inline constexpr JsUtil::IdSpecialization<double, decltype(scNUMBER_CATEGORY)>   scF64{scNUMBER_CATEGORY, "JSU_F64"};

using NumberKinds = std::tuple<uint8_t, uint16_t, uint32_t, uint64_t, int8_t, int16_t, int32_t, int64_t, float, double>;

inline constexpr auto scNUMBER_KINDS =
    std::make_tuple(scU8, scU16, scU32, scU64, scI8, scI16, scI32, scI64, scF32, scF64);

} // namespace JsRTTI
