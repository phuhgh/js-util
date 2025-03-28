#include "JsUtil/Array.hpp"
#include "JsUtil/LangExt.hpp"
#include <gtest/gtest.h>

constexpr auto testLambda = [](int, double) { return 1; };
constexpr auto withRef = [](int& a) -> int& { return a; };
constexpr auto withConstRef = [](int const& a) -> int const& { return a; };

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

    // extras...
    using TRefTraits = LangExt::FunctionTraits<decltype(withRef)>;
    static_assert(std::is_same_v<TRefTraits::TRet, int&>);
    static_assert(std::is_same_v<TRefTraits::argument_t<0>, int&>);

    using TConstRefTraits = LangExt::FunctionTraits<decltype(withConstRef)>;
    static_assert(std::is_same_v<TConstRefTraits::TRet, int const&>);
    static_assert(std::is_same_v<TConstRefTraits::argument_t<0>, int const&>);
}

struct NonDefaultCtor
{
    int val;

    NonDefaultCtor(int p)
        : val(p) {};
};

TEST(ArrayExt, concat)
{
    std::array a{1};
    std::array b{2, 3};
    auto       c = ArrayExt::concat(a, b);
    static_assert(c.size() == 3);
    EXPECT_EQ(c[0], 1);
    EXPECT_EQ(c[1], 2);
    EXPECT_EQ(c[2], 3);

    std::array a1{NonDefaultCtor{1}};
    std::array b1{NonDefaultCtor{2}};
    auto       c1 = ArrayExt::concat(a1, b1);
    static_assert(c1.size() == 2);
    EXPECT_EQ(c1[0].val, 1);
    EXPECT_EQ(c1[1].val, 2);
}