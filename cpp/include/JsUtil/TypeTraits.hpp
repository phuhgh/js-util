#pragma once

#include <concepts>
#include <functional>
#include <type_traits>

namespace JsUtil
{

/// Convenience interface, allows delete from javascript without a specialized method
struct ISharedMemoryObject
{
    virtual ~ISharedMemoryObject() = default;
};

template <typename T>
concept IsUnsigned = std::is_integral_v<T> && !std::is_signed_v<T>;

template <typename T>
concept IsVoidCallback = std::invocable<T> && std::is_void_v<std::invoke_result_t<T>>;

} // namespace JsUtil