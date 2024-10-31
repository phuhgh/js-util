#pragma once

namespace RTTI
{

enum class ENumberIdentifier: uint32_t
{
    U8 = 1,
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

} // namespace RTTI
