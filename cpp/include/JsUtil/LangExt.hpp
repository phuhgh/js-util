#pragma once

#include <array>
#include <tuple>
#include <type_traits>

namespace LangExt
{

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

template <typename TFn, typename TRet, typename... TArgs>
concept Callable = std::invocable<TFn, TArgs...> && std::same_as<std::invoke_result_t<TFn, TArgs...>, TRet>;

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
template <typename Callable>
struct FunctionTraits
{
  private:
    using TTraits = FunctionTraits<decltype(&Callable::operator())>;

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

} // namespace LangExt