#include "JsUtil/FunctionFactory.hpp"
#include <gtest/gtest.h>

struct A
{
    int val;
};
struct B
{
    int val;
};
struct C
{
    int val;
};

auto const f1 = [](A arg, int context) -> B { return B{arg.val + 1 + context}; };
auto const f2 = [](A arg, int context) -> B { return B{arg.val + 2 + context}; };
auto const f3 = [](B arg, int) -> C { return C{arg.val * 2}; };
auto const f4 = [](B arg, int) -> C { return C{arg.val * 3}; };

TEST(FunctionFactory, basicConstexprFunctionComposition)
{
    constexpr auto pipeline = JsUtil::FunctionFactory([](int arg, int context) -> std::tuple<int, int> {
                                  return std::make_tuple(arg, context);
                              }) //
                                  .extend([](std::tuple<int, int> arg, int context) -> int {
                                      return std::get<0>(arg) + std::get<1>(arg) + context;
                                  })
                                  .extend([](int arg, int context) -> int { return (arg * 2) + context; });

    auto result = pipeline.run(2, 3);
    EXPECT_EQ(result, 19);
}

TEST(FunctionFactory, combinatorialFunctionComposition)
{
    constexpr auto combinations =
        TupleExt::combinatorial(std::make_tuple(std::make_tuple(f1, f2), std::make_tuple(f3, f4)));
    static_assert(std::tuple_size_v<decltype(combinations)> == 4);

    constexpr auto functions = JsUtil::applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 4);
    EXPECT_EQ(std::get<0>(functions).run(A{10}, 1).val, 24);
    EXPECT_EQ(std::get<1>(functions).run(A{10}, 1).val, 36);
    EXPECT_EQ(std::get<2>(functions).run(A{10}, 1).val, 26);
    EXPECT_EQ(std::get<3>(functions).run(A{10}, 1).val, 39);
}
