#pragma once

#include "JsUtil/TypeTraits.hpp"
#include <array>
#include <tuple>

namespace LangExt
{

namespace Impl
{
template <typename TFrom, typename TTo>
struct CopyQualifiersImpl
{
    using type_with_const = std::conditional_t<std::is_const_v<TFrom>, std::add_const_t<TTo>, TTo>;

    using type_with_volatile =
        std::conditional_t<std::is_volatile_v<TFrom>, std::add_volatile_t<type_with_const>, type_with_const>;

    using type_with_rvalue = std::conditional_t<
        std::is_rvalue_reference_v<TFrom>,
        std::add_rvalue_reference_t<type_with_volatile>,
        type_with_volatile>;

    using type_with_lvalue = std::conditional_t<
        std::is_lvalue_reference_v<TFrom>,
        std::add_lvalue_reference_t<type_with_rvalue>,
        type_with_rvalue>;

    using type = type_with_lvalue;
};
} // namespace Impl

inline auto const identity = [](auto const& val) { return val; };

inline auto const noop = [](...) {};

template <typename Test, template <typename...> class Ref>
struct IsSpecialization : std::false_type
{
};

template <template <typename...> class Ref, typename... Args>
struct IsSpecialization<Ref<Args...>, Ref> : std::true_type
{
};

template <typename T>
struct FunctionTraits;

// pointer to function
template <typename ReturnType, typename... Args>
struct FunctionTraits<ReturnType (*)(Args...)>
{
    using TRet = ReturnType;
    static constexpr std::size_t arity = sizeof...(Args);

    template <std::size_t Index>
    struct argument
    {
        using type = typename std::tuple_element<Index, std::tuple<Args...>>::type;
    };

    template <std::size_t Index>
    using argument_t = typename argument<Index>::type;
};

// functions
template <typename ReturnType, typename... Args>
struct FunctionTraits<ReturnType(Args...)>
{
    using TRet = ReturnType;
    static constexpr std::size_t arity = sizeof...(Args);

    template <std::size_t Index>
    struct argument
    {
        using type = typename std::tuple_element<Index, std::tuple<Args...>>::type;
    };

    template <std::size_t Index>
    using argument_t = typename argument<Index>::type;
};

// methods
template <typename ReturnType, typename ClassType, typename... Args>
struct FunctionTraits<ReturnType (ClassType::*)(Args...)>
{
    using TRet = ReturnType;
    static constexpr std::size_t arity = sizeof...(Args);

    template <std::size_t Index>
    struct argument
    {
        using type = typename std::tuple_element<Index, std::tuple<Args...>>::type;
    };

    template <std::size_t Index>
    using argument_t = typename argument<Index>::type;
};

// const methods
template <typename ReturnType, typename ClassType, typename... Args>
struct FunctionTraits<ReturnType (ClassType::*)(Args...) const>
{
    using TRet = ReturnType;
    static constexpr std::size_t arity = sizeof...(Args);

    template <std::size_t Index>
    struct argument
    {
        using type = typename std::tuple_element<Index, std::tuple<Args...>>::type;
    };

    template <std::size_t Index>
    using argument_t = typename argument<Index>::type;
};

// lambdas etc
template <typename WithCallable>
struct FunctionTraits
{
  private:
    using TTraits = FunctionTraits<decltype(&WithCallable::operator())>;

  public:
    using TRet = typename TTraits::TRet;
    static constexpr std::size_t arity = TTraits::arity;

    template <std::size_t Index>
    struct argument
    {
        using type = typename TTraits::template argument<Index>::type;
    };

    template <std::size_t Index>
    using argument_t = typename argument<Index>::type;
};

template <JsUtil::WithCallable<void> TCallable>
class FailureGuard
{
  public:
    template <JsUtil::WithCallable<void> TCallableParam>
    explicit FailureGuard(TCallableParam&& on_error)
        : m_onError(std::forward<TCallableParam>(on_error))
    {
    }
    ~FailureGuard()
    {
        if (!m_success)
        {
            m_onError();
        }
    }
    void markSucceeded() { m_success = true; }

  private:
    TCallable m_onError;
    bool      m_success = false;
};

template <JsUtil::WithCallable<void> TCallable>
FailureGuard(TCallable) -> FailureGuard<TCallable>;

template <JsUtil::WithCallable<void> TCallable>
class ScopeGuard
{
  public:
    template <JsUtil::WithCallable<void> T>
    explicit ScopeGuard(T&& onDestroy)
        : m_onDestroy(std::forward<T>(onDestroy))
    {
    }
    ~ScopeGuard() { m_onDestroy(); }

  private:
    TCallable m_onDestroy;
};

template <JsUtil::WithCallable<void> TCallable>
ScopeGuard(TCallable) -> ScopeGuard<TCallable>;

template <JsUtil::WithCallable<void> TCallable>
class OnCreate
{
  public:
    template <JsUtil::WithCallable<void> T>
    explicit OnCreate(T&& onCreate)
        : m_onCreate(std::forward<T>(onCreate))
    {
        m_onCreate();
    }

  private:
    TCallable m_onCreate;
};

template <JsUtil::WithCallable<void> TCallable>
OnCreate(TCallable) -> OnCreate<TCallable>;

template <typename TFrom, typename TTo>
struct CopyQualifiers
{
    using type = Impl::CopyQualifiersImpl<TFrom, TTo>;
};

} // namespace LangExt