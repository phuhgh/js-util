#pragma once

#include <concepts>
#include <functional>
#include <type_traits>

namespace JsUtil
{

template <typename T>
concept WithUnsigned = std::is_integral_v<T> && !std::is_signed_v<T>;

template <typename TFn, typename TRet, typename... TArgs>
concept WithCallable = std::invocable<TFn, TArgs...> && std::same_as<std::invoke_result_t<TFn, TArgs...>, TRet>;


} // namespace JsUtil