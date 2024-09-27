#include "JsUtil/LangExt.hpp"
#include "JsUtil/Tuple.hpp"
#include <gtest/gtest.h>

struct A
{
    int  val{1};
    bool operator==(A const& other) const { return other.val == val; }
};

struct B
{
    int  val{2};
    bool operator==(B const& other) const { return other.val == val; }
};

struct C
{
    int  val{3};
    bool operator==(C const& other) const { return other.val == val; }
};

struct D
{
    int  val{4};
    bool operator==(D const& other) const { return other.val == val; }
};

constexpr auto testCombinations()
{
    constexpr auto input = std::make_tuple(std::make_tuple(A{9}, B{8}), std::make_tuple(C{7}, D{6}));
    return TupleExt::flattenCombinations(input);
}

TEST(Tuple, flattenCombinations)
{
    constexpr auto result = testCombinations();

    // we're substantially interested in the types, so check those explicitly
    using Result = decltype(result);
    static_assert(std::tuple_size<Result>::value == 4, "Result length is incorrect");
    static_assert(
        std::is_same_v<std::tuple_element<0, Result>::type, std::tuple<A, C> const>,
        "First element type in Result is incorrect"
    );
    static_assert(
        std::is_same_v<std::tuple_element<1, Result>::type, std::tuple<A, D> const>,
        "Second element type in Result is incorrect"
    );
    static_assert(
        std::is_same_v<std::tuple_element<2, Result>::type, std::tuple<B, C> const>,
        "Third element type in Result is incorrect"
    );
    static_assert(
        std::is_same_v<std::tuple_element<3, Result>::type, std::tuple<B, D> const>,
        "Fourth element type in Result is incorrect"
    );

    // check the values are those that we constructed, instead of defaults
    EXPECT_EQ(std::get<0>(result), std::make_tuple(A{9}, C{7}));
    EXPECT_EQ(std::get<1>(result), std::make_tuple(A{9}, D{6}));
    EXPECT_EQ(std::get<2>(result), std::make_tuple(B{8}, C{7}));
    EXPECT_EQ(std::get<3>(result), std::make_tuple(B{8}, D{6}));
}

constexpr int forEach()
{
    auto input = std::make_tuple(A{9}, B{8});
    int  r = 0;
    TupleExt::forEach(input, [&r](auto element) { r += element.val; });
    return r;
}

TEST(Tuple, forEach)
{
    constexpr int result = forEach();
    static_assert(result == 17);
}

TEST(Tuple, map)
{
    auto input = std::make_tuple(A{9}, B{8});
    EXPECT_EQ(TupleExt::map(input, LangExt::identity), std::make_tuple(A{9}, B{8}));
}

constexpr int reduceInts()
{
    auto input = std::make_tuple(A{9}, B{8});
    return TupleExt::reduce(input, [&](auto accum, auto element) { return accum + element.val; }, 5);
}

constexpr C reduceVaryingReturn()
{
    auto input = std::make_tuple(A{9}, B{8});
    return TupleExt::reduce(input, [&](auto accum, auto element) { return C{accum.val + element.val}; }, A{5});
}

TEST(Tuple, reduce)
{
    constexpr auto r1 = reduceInts();
    static_assert(r1 == 22);
    constexpr auto r2 = reduceVaryingReturn();
    static_assert(r2.val == 22);
}

TEST(Tuple, flatMap)
{
    auto input = std::make_tuple(std::make_tuple(A{9}), std::make_tuple(B{8}));
    EXPECT_EQ(TupleExt::flatMap(input, LangExt::identity), std::make_tuple(A{9}, B{8}));
}

TEST(Tuple, reverseTuple)
{
    auto input = std::make_tuple(A{9}, B{8}, C{7}, D{6});
    EXPECT_EQ(TupleExt::reverse(input), std::make_tuple(D{6}, C{7}, B{8}, A{9}));
}

TEST(Tuple, indexOf)
{
    auto input = std::make_tuple(A{9}, B{8}, C{7});

    static_assert(TupleExt::IndexOf<A, decltype(input)>::value == 0);
    static_assert(TupleExt::IndexOf<B, decltype(input)>::value == 1);
    static_assert(TupleExt::IndexOf<C, decltype(input)>::value == 2);
}