#include "JsUtil/LangExt.hpp"
#include "JsUtil/Tuple.hpp"
#include <gtest/gtest.h>

struct A
{
    int val{1};
    bool operator==(A const& other) const { return other.val == val; }
};

struct B
{
    int val{2};
    bool operator==(B const& other) const { return other.val == val; }
};

struct C
{
    int val{3};
    bool operator==(C const& other) const { return other.val == val; }
};

struct D
{
    int val{4};
    bool operator==(D const& other) const { return other.val == val; }
};

// for this to be useful, it needs to happen in a constexpr way (this use case being precompiling combinations...)
// the easiest way to ensure this is to have it in a constexpr function
constexpr auto testCombinations()
{
    auto input = std::make_tuple(std::make_tuple(A{9}, B{8}), std::make_tuple(C{7}, D{6}));
    return TupleExt::combinatorial(input);
}

TEST(Tuple, combinitorial)
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