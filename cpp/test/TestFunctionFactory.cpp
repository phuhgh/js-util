#include "JsUtil/FunctionFactory.hpp"
#include "JsUtilTestUtil/MoveOnlyTestObject.hpp"
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

TEST(FunctionFactory, basicConstexprFunctionComposition)
{
    constexpr auto pipeline = Autogen::FunctionFactory([](int context, int arg) -> std::tuple<int, int> {
                                  return std::make_tuple(arg, context);
                              }) //
                                  .extend([](int context, std::tuple<int, int> arg) -> int {
                                      return std::get<0>(arg) + std::get<1>(arg) + context;
                                  })
                                  .extend([](int context, int arg) -> int { return (arg * 2) + context; });

    constexpr auto result = pipeline.run(3, 2);
    EXPECT_EQ(result, 19);
}

TEST(FunctionFactory, moveOnlyObjects)
{
    constexpr auto pipeline =
        Autogen::FunctionFactory(
            [](MoveOnlyTestObject context, MoveOnlyTestObject arg) -> std::tuple<MoveOnlyTestObject, int> {
                return std::make_tuple(std::move(arg), context.m_val);
            }
        )
            .extend([](MoveOnlyTestObject context, std::tuple<MoveOnlyTestObject, int> arg) {
                return std::get<0>(arg).m_val + std::get<1>(arg) + context.m_val;
            })
            .extend([](MoveOnlyTestObject context, int arg) { return MoveOnlyTestObject{(arg * 2) + context.m_val}; });

    constexpr auto result = pipeline.run(MoveOnlyTestObject{3}, MoveOnlyTestObject{2});
    EXPECT_EQ(result.m_val, 19);
}

TEST(FunctionFactory, combinatorialFunctionComposition)
{
    auto constexpr f1 = [](int context, A arg) -> B { return B{arg.val + 1 + context}; };
    auto constexpr f2 = [](int context, A arg) -> B { return B{arg.val + 2 + context}; };
    auto constexpr f3 = [](int, B arg) -> C { return C{arg.val * 2}; };
    auto constexpr f4 = [](int, B arg) -> C { return C{arg.val * 3}; };

    constexpr auto combinations =
        TupleExt::flattenCombinations(std::make_tuple(std::make_tuple(f1, f2), std::make_tuple(f3, f4)));
    static_assert(std::tuple_size_v<decltype(combinations)> == 4);

    constexpr auto functions = Autogen::applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 4);

    EXPECT_EQ(std::get<0>(functions).run(1, A{10}).val, 24);
    EXPECT_EQ(std::get<1>(functions).run(1, A{10}).val, 36);
    EXPECT_EQ(std::get<2>(functions).run(1, A{10}).val, 26);
    EXPECT_EQ(std::get<3>(functions).run(1, A{10}).val, 39);
}

TEST(FunctionFactory, operatorsForEachBasic)
{
    // test default options (single item etc)
    struct TestContext
    {
        std::vector<C>* result;
        int             value;
    };

    std::vector<C> o1Result;
    std::vector<C> o2Result;
    TestContext    o1Context{&o1Result, 1};
    TestContext    o2Context{&o2Result, 1};

    auto constexpr operations = std::make_tuple(
        std::make_tuple([](TestContext const& context, int arg) {
            return std::vector<B>{B{arg}, B{context.value}};
        }),
        std::make_tuple(Autogen::ForEachConnector()),
        std::make_tuple(
            [](TestContext const& context, B arg) -> void { context.result->emplace_back(C{arg.val * 2}); },
            [](TestContext const& context, B arg) -> void { context.result->emplace_back(C{arg.val * 3}); }
        )
    );

    constexpr auto combinations = TupleExt::flattenCombinations(operations);
    static_assert(std::tuple_size_v<decltype(combinations)> == 2);
    constexpr auto functions = Autogen::applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 2);

    // factory generation is constexpr, the actual running of the pipeline is not in this case
    std::get<0>(functions).run(o1Context, 2);
    std::get<1>(functions).run(o2Context, 2);

    EXPECT_EQ(o1Result.size(), 2);
    EXPECT_EQ(o1Result[0].val, 4);
    EXPECT_EQ(o1Result[1].val, 2);
    EXPECT_EQ(o2Result.size(), 2);
    EXPECT_EQ(o2Result[0].val, 6);
    EXPECT_EQ(o2Result[1].val, 3);
}

TEST(FunctionFactory, operatorsForEachWindowed)
{
    // larger window, different stride etc
    struct TestContext
    {
        std::vector<C>* result;
        int             value;
    };

    std::vector<C> o1Result;
    std::vector<C> o2Result;
    TestContext    o1Context{&o1Result, 1};
    TestContext    o2Context{&o2Result, 1};

    auto constexpr operations = std::make_tuple(
        std::make_tuple([](TestContext const& context, int arg) {
            return std::vector{B{arg}, B{context.value}, B{-1}};
        }),
        std::make_tuple(Autogen::ForEachConnector(Autogen::ForEachConnector<2>::Options{
            .stride = 3,
        })),
        std::make_tuple(
            [](TestContext const& context, B a1, B a2) -> void {
                context.result->emplace_back(C{(a1.val * 2) + a2.val});
            },
            [](TestContext const& context, B a1, B a2) -> void {
                context.result->emplace_back(C{(a1.val * 3) + a2.val});
            }
        )
    );

    constexpr auto combinations = TupleExt::flattenCombinations(operations);
    static_assert(std::tuple_size_v<decltype(combinations)> == 2);
    constexpr auto functions = Autogen::applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 2);

    // factory generation is constexpr, the actual running of the pipeline is not in this case
    std::get<0>(functions).run(o1Context, 2);
    std::get<1>(functions).run(o2Context, 2);

    EXPECT_EQ(o1Result.size(), 1);
    EXPECT_EQ(o1Result[0].val, 5);
    EXPECT_EQ(o2Result.size(), 1);
    EXPECT_EQ(o2Result[0].val, 7);
}

TEST(FunctionFactory, operatorsForSpan)
{
    struct TestContext
    {
        std::vector<C>* result;
        int             value;
    };

    std::vector<C> o1Result;
    std::vector<C> o2Result;
    TestContext    o1Context{&o1Result, 1};
    TestContext    o2Context{&o2Result, 1};

    auto constexpr operations = std::make_tuple(
        std::make_tuple([](TestContext const& context, int arg) {
            return std::vector{B{arg}, B{context.value}, B{-1}};
        }),
        std::make_tuple(Autogen::ForEachSpanConnector({.spanSize = 2, .stride = 3})),
        std::make_tuple(
            [](TestContext const& context, std::span<B> span) -> void {
                for (auto item : span)
                {
                    context.result->emplace_back(C{item.val * 2});
                }
            },
            [](TestContext const& context, std::span<B> span) -> void {
                for (auto item : span)
                {
                    context.result->emplace_back(C{item.val * 3});
                };
            }
        )
    );

    constexpr auto combinations = TupleExt::flattenCombinations(operations);
    static_assert(std::tuple_size_v<decltype(combinations)> == 2);
    constexpr auto functions = Autogen::applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 2);

    // factory generation is constexpr, the actual running of the pipeline is not in this case
    std::get<0>(functions).run(o1Context, 2);
    std::get<1>(functions).run(o2Context, 2);

    EXPECT_EQ(o1Result.size(), 2);
    EXPECT_EQ(o1Result[0].val, 4);
    EXPECT_EQ(o1Result[1].val, 2);
    EXPECT_EQ(o2Result.size(), 2);
    EXPECT_EQ(o2Result[0].val, 6);
    EXPECT_EQ(o2Result[1].val, 3);
}