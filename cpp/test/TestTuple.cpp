#include "JsUtil/LangExt.hpp"
#include "JsUtil/Tuple.hpp"
#include "JsUtilTestUtil/TestObjects.hpp"
#include <gtest/gtest.h>

struct A
{
    int val{101};

    bool operator==(A const& other) const { return other.val == val; }
};

struct B
{
    int  val{102};
    bool operator==(B const& other) const { return other.val == val; }
};

struct C
{
    int  val{103};
    bool operator==(C const& other) const { return other.val == val; }
};

struct D
{
    int  val{104};
    bool operator==(D const& other) const { return other.val == val; }
};

struct E
{
    int  val{105};
    bool operator==(E const& other) const { return other.val == val; }
};

struct F
{
    int  val{106};
    bool operator==(F const& other) const { return other.val == val; }
};

inline constexpr A a{9};
inline constexpr B b{8};
inline constexpr C c{7};
inline constexpr D d{6};
inline constexpr E e{5};
inline constexpr F f{4};

TEST(Tuple, flattenCombinations)
{
    constexpr auto combinations = std::make_tuple(
        std::make_tuple(a, b), //
        std::make_tuple(e, f),
        std::make_tuple(e, f, c)
    );
    constexpr auto result = TupleExt::flattenCombinations(combinations);

    // we're substantially interested in the types, so check those explicitly
    using Result = decltype(result);
    static_assert(std::tuple_size<Result>::value == 12, "Result length is incorrect");

    // check the values are those that we constructed, instead of defaults
    EXPECT_EQ(std::get<0>(result), std::make_tuple(a, e, e));
    EXPECT_EQ(std::get<1>(result), std::make_tuple(a, e, f));
    EXPECT_EQ(std::get<2>(result), std::make_tuple(a, e, c));
    EXPECT_EQ(std::get<3>(result), std::make_tuple(a, f, e));
    EXPECT_EQ(std::get<4>(result), std::make_tuple(a, f, f));
    EXPECT_EQ(std::get<5>(result), std::make_tuple(a, f, c));
    EXPECT_EQ(std::get<6>(result), std::make_tuple(b, e, e));

    constexpr auto offsets = TupleExt::getCombinationOffsets(combinations);
    static_assert(std::tuple_size<decltype(offsets)>::value == 3, "offset length should match input length");
    EXPECT_EQ(std::get<0>(offsets), std::make_tuple(0, 6));
    EXPECT_EQ(std::get<1>(offsets), std::make_tuple(0, 3));
    EXPECT_EQ(std::get<2>(offsets), std::make_tuple(0, 1, 2));
}

consteval int forEach()
{
    auto input = std::make_tuple(a, b);
    int  r = 0;
    TupleExt::forEach(input, [&r](auto element) { r += element.val; });
    return r;
}

TEST(Tuple, forEach)
{
    constexpr int result = forEach();
    static_assert(result == 17);
}

consteval int forEachWithIndex()
{
    auto input = std::make_tuple(a, b);
    int  r = 0;
    TupleExt::forEach(input, [&r](auto element, size_t index) { r += element.val + index; });
    return r;
}

TEST(Tuple, forEachWithIndex)
{
    constexpr int result = forEachWithIndex();
    static_assert(result == 18);
}

TEST(Tuple, map)
{
    auto input = std::make_tuple(a, b);
    EXPECT_EQ(TupleExt::map(input, LangExt::identity), std::make_tuple(a, b));
}

TEST(Tuple, mapWithIndexes)
{
    auto input = std::make_tuple(a, b);
    EXPECT_EQ(TupleExt::map(input, [](auto const&, size_t index) { return index; }), std::make_tuple(0, 1));
    EXPECT_EQ(TupleExt::map(input, [](auto const& item, size_t) { return item; }), std::make_tuple(a, b));
}

constexpr int reduceInts()
{
    auto input = std::make_tuple(a, b);
    return TupleExt::reduce(input, [&](auto accum, auto element) { return accum + element.val; }, 5);
}

constexpr C reduceVaryingReturn()
{
    auto input = std::make_tuple(a, b);
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
    auto input = std::make_tuple(std::make_tuple(a), std::make_tuple(b));
    EXPECT_EQ(TupleExt::flatMap(input, LangExt::identity), std::make_tuple(a, b));
}

TEST(Tuple, reverseTuple)
{
    auto input = std::make_tuple(a, b, c, D{6});
    EXPECT_EQ(TupleExt::reverse(input), std::make_tuple(D{6}, c, b, a));
}

TEST(Tuple, indexOf)
{
    auto input = std::make_tuple(a, b, c);

    static_assert(TupleExt::IndexOf<A, decltype(input)>::value == 0);
    static_assert(TupleExt::IndexOf<B, decltype(input)>::value == 1);
    static_assert(TupleExt::IndexOf<C, decltype(input)>::value == 2);
}

TEST(Tuple, uniformity)
{
    static_assert(!TupleExt::IsUniform<std::tuple<A, B, C>>::value);
    static_assert(TupleExt::IsUniform<std::tuple<A>>::value);
    static_assert(TupleExt::IsUniform<std::tuple<A, A>>::value);
}

TEST(Tuple, select)
{
    auto  input = std::make_tuple(a, A{8}, A{7});
    auto& element = TupleExt::select(input, 1);
    EXPECT_EQ(element.val, 8);
    element.val = 1;
    EXPECT_EQ(TupleExt::select(input, 1).val, 1);
}

TEST(Tuple, selectNoCopy)
{
    auto  input = std::make_tuple(::MoveOnlyTestObject{3}, ::MoveOnlyTestObject{2}, ::MoveOnlyTestObject{1});
    auto& element = TupleExt::select(input, 1);
    EXPECT_EQ(element.m_val, 2);
    element.m_val = 1;
    EXPECT_EQ(TupleExt::select(input, 1).m_val, 1);
}

// it sounds like an oxymoron (and it probably should be), but it's useful even in constexpr contexts...
TEST(Tuple, constexprSelect)
{
    constexpr auto input = std::make_tuple(a, A{8}, A{7});
    constexpr auto element = TupleExt::select(input, 1);
    EXPECT_EQ(element.val, 8);
}

TEST(Tuple, spiltAt)
{
    constexpr auto result = TupleExt::splitAt<2>(std::make_tuple(a, b, c, d, e, f));
    EXPECT_EQ(std::get<0>(result), std::make_tuple(a, b));
    EXPECT_EQ(std::get<1>(result), std::make_tuple(c, d, e, f));
    // shouldn't be an issue, but check it plays nice with empty...
    EXPECT_EQ(std::get<0>(TupleExt::splitAt<0>(std::make_tuple(a, b, c, d, e, f))), std::make_tuple());
    EXPECT_EQ(std::get<1>(TupleExt::splitAt<6>(std::make_tuple(a, b, c, d, e, f))), std::make_tuple());
}
