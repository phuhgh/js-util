#include "JsUtil/LangExt.hpp"
#include <gtest/gtest.h>

constexpr auto testLambda = [](int, double) { return 1; };

float testFn(int, double)
{
    return 1;
}

struct TestMethod
{
    double m(int, double) { return 1; }
};

TEST(LangExt, functionTraits)
{
    using TLambdaTraits = LangExt::FunctionTraits<decltype(testLambda)>;
    using TFnTraits = LangExt::FunctionTraits<decltype(testFn)>;
    using TMethodTraits = LangExt::FunctionTraits<decltype(&TestMethod::m)>;

    // returns
    static_assert(std::is_same_v<TLambdaTraits::TRet, int>);
    static_assert(std::is_same_v<TFnTraits::TRet, float>);
    static_assert(std::is_same_v<TMethodTraits::TRet, double>);

    // args
    static_assert(TLambdaTraits::arity == 2);
    static_assert(std::is_same_v<TLambdaTraits::argument_t<0>, int>);
    static_assert(std::is_same_v<TLambdaTraits::argument_t<1>, double>);

    static_assert(TFnTraits::arity == 2);
    static_assert(std::is_same_v<TFnTraits::argument_t<0>, int>);
    static_assert(std::is_same_v<TFnTraits::argument_t<1>, double>);

    static_assert(TMethodTraits::arity == 2);
    static_assert(std::is_same_v<TMethodTraits::argument_t<0>, int>);
    static_assert(std::is_same_v<TMethodTraits::argument_t<1>, double>);
}
