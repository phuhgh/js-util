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

template <typename TFn, typename TRet, typename... TArgs>
concept WithNoThrowCallable = WithCallable<TFn, TRet, TArgs...> && std::is_nothrow_invocable_r_v<TRet, TFn, TArgs...>;

} // namespace JsUtil