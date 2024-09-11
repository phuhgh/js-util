#pragma once

#include <array>
#include <type_traits>

namespace LangExt
{

inline auto const identity = [](auto const& val) { return val; };

inline auto const noop = [](...) {};

template<typename Test, template<typename...> class Ref>
struct is_specialization : std::false_type {
};

template<template<typename...> class Ref, typename... Args>
struct is_specialization<Ref<Args...>, Ref> : std::true_type {
};


} // namespace LangExt