#include "JsUtil/FunctionFactory.hpp"
#include "JsUtil/SharedArray.hpp"
#include "JsUtil/Tuple.hpp"
#include "JsUtil/Vec2.hpp"
#include "JsUtilTestUtil/DisableJsIntegration.hpp"
#include "JsUtilTestUtil/TestObjects.hpp"
#include <JsUtil/Range2d.hpp>
#include <gtest/gtest.h>
#include <numeric>

[[maybe_unused]] static DisableJsIntegration const scDISABLE_JS_INTEGRATION;

inline constexpr JsUtil::IdCategory<struct Cat1, void>                        scTEST_CAT_1{"CAT_1"};
inline constexpr JsUtil::IdSpecialization<struct C1A, decltype(scTEST_CAT_1)> scTEST_SPEC_1_A{scTEST_CAT_1, "1_A"};
inline constexpr JsUtil::IdSpecialization<struct C1B, decltype(scTEST_CAT_1)> scTEST_SPEC_1_B{scTEST_CAT_1, "1_B"};

inline constexpr JsUtil::IdCategory<struct Cat2, void>                        scTEST_CAT_2{"CAT_2"};
inline constexpr JsUtil::IdSpecialization<struct C2A, decltype(scTEST_CAT_2)> scTEST_SPEC_2_A{scTEST_CAT_2, "2_A"};
inline constexpr JsUtil::IdSpecialization<struct C2B, decltype(scTEST_CAT_2)> scTEST_SPEC_2_B{scTEST_CAT_2, "2_B"};

inline constexpr JsUtil::IdCategory<struct Cat3, void>                        scTEST_CAT_3{"CAT_3"};
inline constexpr JsUtil::IdSpecialization<struct C3A, decltype(scTEST_CAT_3)> scTEST_SPEC_3_A{scTEST_CAT_3, "3_A"};
inline constexpr JsUtil::IdSpecialization<struct C3B, decltype(scTEST_CAT_3)> scTEST_SPEC_3_B{scTEST_CAT_3, "3_B"};

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

auto constexpr f1 = [](int context, A arg) -> B { return B{arg.val + 1 + context}; };
auto constexpr f2 = [](int context, A arg) -> B { return B{arg.val + 2 + context}; };
auto constexpr f3 = [](int context, A arg) -> B { return B{arg.val + 3 + context}; };
auto constexpr f4 = [](int context, A arg) -> B { return B{arg.val + 5 + context}; };
auto constexpr f5 = [](int context, A arg) -> B { return B{arg.val + 6 + context}; };

TEST(FunctionFactory, basicConstexprFunctionComposition)
{
    constexpr auto pipeline = Autogen::FunctionFactory([](int context, int arg) -> std::tuple<int, int> {
                                  return std::make_tuple(arg, context);
                              }) //
                                  .extend([](int context, std::tuple<int, int> const& arg) -> int {
                                      return std::get<0>(arg) + std::get<1>(arg) + context;
                                  })
                                  .extend([](int context, int arg) -> int { return arg * 2 + context; });

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
            .extend([](MoveOnlyTestObject context, std::tuple<MoveOnlyTestObject, int> const& arg) {
                return std::get<0>(arg).m_val + std::get<1>(arg) + context.m_val;
            })
            .extend([](MoveOnlyTestObject context, int arg) { return MoveOnlyTestObject{arg * 2 + context.m_val}; });

    constexpr auto result = pipeline.run(MoveOnlyTestObject{3}, MoveOnlyTestObject{2});
    EXPECT_EQ(result.m_val, 19);
}

TEST(FunctionFactory, combinatorialFunctionComposition)
{
    auto constexpr a_f3 = [](int, B arg) -> C { return C{arg.val * 2}; };
    auto constexpr a_f4 = [](int, B arg) -> C { return C{arg.val * 3}; };

    constexpr auto combinations =
        TupleExt::flattenCombinations(
            std::make_tuple( //
                std::make_tuple(Autogen::FuncStep{scTEST_SPEC_1_A, f1}, Autogen::FuncStep{ scTEST_SPEC_1_B, f2}),
                std::make_tuple(Autogen::FuncStep{ scTEST_SPEC_2_A, a_f3}, Autogen::FuncStep{ scTEST_SPEC_2_B, a_f4})));
    static_assert(std::tuple_size_v<decltype(combinations)> == 4);

    constexpr auto functions = applyFunctionFactory(combinations);
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

    std::vector<C>    o1Result;
    std::vector<C>    o2Result;
    TestContext const o1Context{&o1Result, 1};
    TestContext const o2Context{&o2Result, 1};

    auto constexpr operations = std::make_tuple(
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_1_A,
                [](TestContext const& context, int arg) { return std::vector{B{arg}, B{context.value}}; }
            }
        ),
        std::make_tuple(
            Autogen::IteratorConnector(Autogen::Iterators::scFOR_EACH_ELEMENT<JsUtil::SegmentedDataViewOptions{}>)
        ),
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_2_A,
                [](TestContext const& context, B arg) -> void { context.result->emplace_back(C{arg.val * 2}); }
            },
            Autogen::FuncStep{
                scTEST_SPEC_2_B,
                [](TestContext const& context, B arg) -> void { context.result->emplace_back(C{arg.val * 3}); }
            }
        )
    );

    constexpr auto combinations = TupleExt::flattenCombinations(operations);
    static_assert(std::tuple_size_v<decltype(combinations)> == 2);
    constexpr auto functions = applyFunctionFactory(combinations);
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

    std::vector<C>    o1Result;
    std::vector<C>    o2Result;
    TestContext const o1Context{&o1Result, 1};
    TestContext const o2Context{&o2Result, 1};

    auto constexpr operations = std::make_tuple(
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_1_A,
                [](TestContext const& context, int arg) { return std::vector{B{arg}, B{context.value}, B{-1}}; }
            }
        ),
        std::make_tuple(
            Autogen::
                IteratorConnector(Autogen::Iterators::scFOR_EACH_ELEMENT<JsUtil::SegmentedDataViewOptions{.blockSize = 2, .stride = 3}>)
        ),
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_2_A,
                [](TestContext const& context, B a1, B a2) -> void {
                    context.result->emplace_back(C{a1.val * 2 + a2.val});
                }
            },
            Autogen::FuncStep{
                scTEST_SPEC_2_B,
                [](TestContext const& context, B a1, B a2) -> void {
                    context.result->emplace_back(C{a1.val * 3 + a2.val});
                }
            }
        )
    );

    constexpr auto combinations = TupleExt::flattenCombinations(operations);
    static_assert(std::tuple_size_v<decltype(combinations)> == 2);
    constexpr auto functions = applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 2);

    // factory generation is constexpr, the actual running of the pipeline is not in this case
    std::get<0>(functions).run(o1Context, 2);
    std::get<1>(functions).run(o2Context, 2);

    EXPECT_EQ(o1Result.size(), 1);
    EXPECT_EQ(o1Result[0].val, 5);
    EXPECT_EQ(o2Result.size(), 1);
    EXPECT_EQ(o2Result[0].val, 7);
}

TEST(FunctionFactory, operatorsForEachWindowedNoCopy)
{
    auto v = std::vector<MoveOnlyTestObject>{};
    v.emplace_back(MoveOnlyTestObject{1});
    v.emplace_back(MoveOnlyTestObject{2});
    v.emplace_back(MoveOnlyTestObject{-1});

    // larger window, different stride etc
    struct TestContext
    {
        std::vector<C>* result;
        int             value;
    };

    std::vector<C>    o1Result;
    TestContext const o1Context{&o1Result, 1};

    auto constexpr operations = std::make_tuple(
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_1_A,
                [](TestContext const&, std::vector<MoveOnlyTestObject> const& arg) { return std::span{arg}; }
            }
        ),
        std::make_tuple(
            Autogen::
                IteratorConnector(Autogen::Iterators::scFOR_EACH_ELEMENT<JsUtil::SegmentedDataViewOptions{.blockSize = 2, .stride = 3}>)
        ),
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_2_A,
                [](TestContext const& context, MoveOnlyTestObject const& a1, MoveOnlyTestObject const& a2) -> void {
                    context.result->emplace_back(C{a1.m_val * 2 + a2.m_val});
                }
            }
        )
    );

    constexpr auto combinations = TupleExt::flattenCombinations(operations);
    static_assert(std::tuple_size_v<decltype(combinations)> == 1);
    constexpr auto functions = applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 1);

    // factory generation is constexpr, the actual running of the pipeline is not in this case
    std::get<0>(functions).run(o1Context, v);

    EXPECT_EQ(o1Result.size(), 1);
    EXPECT_EQ(o1Result[0].val, 4);
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

    // initializer lists copy...
    auto v = std::vector<MoveOnlyTestObject>{};
    v.emplace_back(MoveOnlyTestObject{2});
    v.emplace_back(MoveOnlyTestObject{99});
    v.emplace_back(MoveOnlyTestObject{-1});

    auto constexpr operations = std::make_tuple(
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_1_A,
                [](TestContext const& context, std::vector<MoveOnlyTestObject>& arg) {
                    arg[1].m_val = context.value; // this ought to be a hanging offense, but we're just checking...
                    return JsUtil::SegmentedDataView{arg, {.blockSize = 2, .stride = 3}};
                }
            }
        ),
        std::make_tuple(
            Autogen::IteratorConnector([]<class TContext, class TArg, class TStep>(
                                           TContext const& context, TArg const& items, TStep callback
                                       ) {
                for (typename TArg::size_type i = 0, length = items.getLength(); i < length; ++i)
                {
                    callback(context, items.getBlock(i));
                }
            })
        ),
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_2_A,
                [](TestContext const& context, std::span<MoveOnlyTestObject const> span) -> void {
                    for (auto const& item : span)
                    {
                        context.result->emplace_back(C{item.m_val * 2});
                    }
                }
            },
            Autogen::FuncStep{
                scTEST_SPEC_2_B,
                [](TestContext const& context, std::span<MoveOnlyTestObject const> span) -> void {
                    for (auto const& item : span)
                    {
                        context.result->emplace_back(C{item.m_val * 3});
                    }
                }
            }
        )
    );

    constexpr auto combinations = TupleExt::flattenCombinations(operations);
    static_assert(std::tuple_size_v<decltype(combinations)> == 2);
    constexpr auto functions = applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 2);

    // factory generation is constexpr, the actual running of the pipeline is not in this case
    std::get<0>(functions).run(o1Context, v);
    std::get<1>(functions).run(o2Context, v);

    EXPECT_EQ(o1Result.size(), 2);
    EXPECT_EQ(o1Result[0].val, 4);
    EXPECT_EQ(o1Result[1].val, 2);
    EXPECT_EQ(o2Result.size(), 2);
    EXPECT_EQ(o2Result[0].val, 6);
    EXPECT_EQ(o2Result[1].val, 3);
}

TEST(FunctionFactory, operatorsForSpanNoCopy)
{
    // initializer lists copy...
    auto v = std::vector<MoveOnlyTestObject>{};
    v.emplace_back(MoveOnlyTestObject{1});
    v.emplace_back(MoveOnlyTestObject{2});
    v.emplace_back(MoveOnlyTestObject{-1});

    struct TestContext
    {
        std::vector<C>* result;
        int             value;
    };

    std::vector<C>    o1Result;
    TestContext const o1Context{&o1Result, 1};

    auto constexpr operations = std::make_tuple(
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_1_A,
                [](TestContext const&, std::vector<MoveOnlyTestObject> const& arg) {
                    return JsUtil::SegmentedDataView{arg, {.blockSize = 2, .stride = 3}};
                }
            }
        ),
        std::make_tuple(Autogen::IteratorConnector(Autogen::Iterators::scFOR_EACH_SEGMENT)),
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_2_A,
                [](TestContext const& context, std::span<MoveOnlyTestObject const> span) -> void {
                    for (auto const& item : span)
                    {
                        context.result->emplace_back(C{item.m_val * 2});
                    }
                }
            }
        )
    );

    constexpr auto combinations = TupleExt::flattenCombinations(operations);
    static_assert(std::tuple_size_v<decltype(combinations)> == 1);
    constexpr auto functions = applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 1);

    // factory generation is constexpr, the actual running of the pipeline is not in this case
    std::get<0>(functions).run(o1Context, v);

    EXPECT_EQ(o1Result.size(), 2);
    EXPECT_EQ(o1Result[0].val, 2);
    EXPECT_EQ(o1Result[1].val, 4);
}

TEST(FunctionFactory, contextNoCopy)
{
    struct TestContext
    {
        std::vector<MoveOnlyTestObject> result;
    };

    auto constexpr operations = std::make_tuple(
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_1_A,
                [](TestContext& context, int arg) -> int {
                    context.result.emplace_back(arg);
                    return 10;
                }
            }
        ),
        std::make_tuple(
            Autogen::FuncStep{
                scTEST_SPEC_2_A, [](TestContext& context, int arg) -> void { context.result.emplace_back(arg); }
            }
        )
    );

    constexpr auto combinations = TupleExt::flattenCombinations(operations);
    static_assert(std::tuple_size_v<decltype(combinations)> == 1);
    constexpr auto functions = applyFunctionFactory(combinations);
    static_assert(std::tuple_size_v<decltype(functions)> == 1);

    // this is technically supported, but probably an absolutely awful idea
    TestContext context{};
    std::get<0>(functions).run(context, 1);
    EXPECT_EQ(context.result.size(), 2);
    EXPECT_EQ(context.result[0].m_val, 1);
    EXPECT_EQ(context.result[1].m_val, 10);
}

TEST(FunctionFactory, getFunctionOffsets)
{
    constexpr auto specification = std::make_tuple(
        std::make_tuple(Autogen::FuncStep{scTEST_SPEC_1_A, f1}, Autogen::FuncStep{scTEST_SPEC_1_B, f2}),
        std::make_tuple(Autogen::FuncStep{scTEST_SPEC_2_A, f3}),
        std::make_tuple(Autogen::FuncStep{scTEST_SPEC_3_A, f4}, Autogen::FuncStep{scTEST_SPEC_3_B, f5})
    );

    constexpr auto mapping = Autogen::Impl::getFunctionOffsets(specification);
    static_assert(std::tuple_size_v<decltype(mapping)> == 3);
    EXPECT_EQ(std::get<0>(mapping), (std::tuple<size_t, size_t>{0, 2}));
    EXPECT_EQ(std::get<1>(mapping), std::tuple<size_t>{0});
    EXPECT_EQ(std::get<2>(mapping), (std::tuple<size_t, size_t>{0, 1}));
}

TEST(FunctionFactory, getRequiredCategories)
{
    // this is a little brittle because it depends on initialization order
    EXPECT_EQ(JsUtil::getCategoryId(scTEST_CAT_1), 1);
    EXPECT_EQ(JsUtil::getCategoryId(scTEST_CAT_2), 2);
    EXPECT_EQ(JsUtil::getCategoryId(scTEST_CAT_3), 3);

    constexpr auto specification = std::make_tuple(
        std::make_tuple(Autogen::FuncStep{scTEST_SPEC_1_A, f1}, Autogen::FuncStep{scTEST_SPEC_1_B, f2}),
        std::make_tuple(Autogen::FuncStep{scTEST_SPEC_2_A, f3}),
        std::make_tuple(Autogen::FuncStep{scTEST_SPEC_3_A, f4}, Autogen::FuncStep{scTEST_SPEC_3_B, f5})
    );

    auto requiredCats = getRequiredCategories(specification);
    static_assert(std::tuple_size_v<decltype(requiredCats)> == 2);
    EXPECT_EQ(
        requiredCats,
        (std::array<uint32_t, 2>{JsUtil::getCategoryId(scTEST_CAT_1), JsUtil::getCategoryId(scTEST_CAT_3)})
    );
}

TEST(FunctionFactory, getMapping)
{
    // this is a little brittle because it depends on initialization order
    EXPECT_EQ(JsUtil::getCategoryId(scTEST_CAT_1), 1);
    EXPECT_EQ(JsUtil::getCategoryId(scTEST_CAT_2), 2);
    EXPECT_EQ(JsUtil::getCategoryId(scTEST_CAT_3), 3);

    EXPECT_EQ(JsUtil::getSpecializationId(scTEST_SPEC_1_A), 1);
    EXPECT_EQ(JsUtil::getSpecializationId(scTEST_SPEC_1_B), 2);
    EXPECT_EQ(JsUtil::getSpecializationId(scTEST_SPEC_2_A), 1);
    EXPECT_EQ(JsUtil::getSpecializationId(scTEST_SPEC_3_A), 1);
    EXPECT_EQ(JsUtil::getSpecializationId(scTEST_SPEC_3_B), 2);

    constexpr auto pipeline_specification = std::make_tuple(
        std::make_tuple(Autogen::FuncStep{scTEST_SPEC_1_A, f1}, Autogen::FuncStep{scTEST_SPEC_1_B, f2}),
        std::make_tuple(
            Autogen::FuncStep{scTEST_SPEC_2_A, [](int context, B arg) -> A { return A{arg.val + 3 + context}; }}
        ),
        std::make_tuple(Autogen::FuncStep{scTEST_SPEC_3_A, f4}, Autogen::FuncStep{scTEST_SPEC_3_B, f5})
    );

    static_assert(
        std::tuple_size_v<decltype(applyFunctionFactory(TupleExt::flattenCombinations(pipeline_specification)))> == 4
    );

    auto mapping = createFunctionMapping(pipeline_specification);
    ASSERT_NE(mapping.find(JsUtil::getCategoryId(scTEST_CAT_1)), nullptr);
    ASSERT_NE(mapping.find(JsUtil::getCategoryId(scTEST_CAT_1))->find(1), nullptr);
    EXPECT_EQ(*mapping.find(JsUtil::getCategoryId(scTEST_CAT_1))->find(1), 0);
    ASSERT_NE(mapping.find(JsUtil::getCategoryId(scTEST_CAT_1))->find(2), nullptr);
    EXPECT_EQ(*mapping.find(JsUtil::getCategoryId(scTEST_CAT_1))->find(2), 2);

    // this is a meaningless category - there is only one step in the stage
    ASSERT_NE(mapping.find(JsUtil::getCategoryId(scTEST_CAT_2)), nullptr);
    EXPECT_EQ(*mapping.find(JsUtil::getCategoryId(scTEST_CAT_2))->find(1), 0);

    ASSERT_NE(mapping.find(JsUtil::getCategoryId(scTEST_CAT_3)), nullptr);
    ASSERT_NE(mapping.find(JsUtil::getCategoryId(scTEST_CAT_3))->find(1), nullptr);
    EXPECT_EQ(*mapping.find(JsUtil::getCategoryId(scTEST_CAT_3))->find(1), 0);
    ASSERT_NE(mapping.find(JsUtil::getCategoryId(scTEST_CAT_3))->find(2), nullptr);
    EXPECT_EQ(*mapping.find(JsUtil::getCategoryId(scTEST_CAT_3))->find(2), 1);
}

struct Point2dOffsets
{
    std::uint8_t x{0};
    std::uint8_t y{1};
    std::uint8_t size{2};
    std::uint8_t color{3};
    std::uint8_t stride{4};
};
struct Index2dContext
{
    uint16_t            entityId{1};
    Point2dOffsets      dataDescription;
    JsUtil::Mat3<float> worldTransform = JsUtil::Mat3<float>{}.setScalingMatrix(2, 3);

    // avoid dynamic allocation for the purposes of assembly inspection
    unsigned                                aabbCount;
    std::array<JsUtil::Range2d<float>, 128> aabbs;
};

/**
 * input:
 * pipeline entity { specMap: [cat -> spec]}
 * pipeline specification [catA, catB, ...]
 * -> pipeline index
 *
 * steps:
 * - convert into points
 * - apply data space transform (e.g. log)
 * - apply screen space transform
 * - convert into AABB
 * - insert into quad tree
 */
constexpr auto scPIPE = std::make_tuple(
    std::make_tuple(
        Autogen::FuncStep{
            scTEST_SPEC_1_A,
            [](Index2dContext& context, JsUtil::ResizableArray<float> const& data) {
                return JsUtil::SegmentedDataView{
                    data, {.blockSize = context.dataDescription.stride, .stride = context.dataDescription.stride}
                };
            }
        }
    ),
    std::make_tuple(
        Autogen::IteratorConnector(
            []<class TContext, class TArg, class TStep>(TContext&& context, TArg&& items, TStep&& callback) {
                auto xOffset = std::forward<TContext>(context).dataDescription.x;
                auto yOffset = std::forward<TContext>(context).dataDescription.y;

                for (typename TArg::size_type i = 0, length = std::forward<TArg>(items).getLength(); i + 1 < length;
                     ++i)
                {
                    auto createPoint = [xOffset, yOffset](std::span<float const> block, auto&) {
                        return JsUtil::Vec2<float>{{block[xOffset], block[yOffset]}};
                    };

                    std::forward<TStep>(callback)(
                        std::forward<TContext>(context),
                        std::make_pair(
                            std::forward<TArg>(items).mapBlock(i, createPoint),
                            std::forward<TArg>(items).mapBlock(i + 1, createPoint)
                        )
                    );
                }
            }
        )
    ),
    std::make_tuple(
        Autogen::FuncStep{
            scTEST_SPEC_3_A,
            [](Index2dContext&, TupleExt::RepeatedPair<JsUtil::Vec2<float>> points) {
                // a totally ridiculous space transform, but easy to test...
                points.first[0] += 1;
                points.first[1] += 2;
                points.second[0] += 3;
                points.second[1] += 4;
                return points;
            }
        }
    ),
    std::make_tuple(
        Autogen::FuncStep{
            scTEST_SPEC_3_A,
            [](Index2dContext& context, TupleExt::RepeatedPair<JsUtil::Vec2<float>> points) {
                points.first.matrixMultiply(context.worldTransform);
                points.second.matrixMultiply(context.worldTransform);
                return points;
            }
        }
    ),
    std::make_tuple(
        Autogen::FuncStep{
            scTEST_SPEC_3_A,
            [](Index2dContext&, TupleExt::RepeatedPair<JsUtil::Vec2<float>> points) {
                return JsUtil::Range2d<float>::fromPair(points);
            }
        }
    ),
    std::make_tuple(
        Autogen::FuncStep{
            scTEST_SPEC_3_A,
            [](Index2dContext& context, JsUtil::Range2d<float> aabb) { context.aabbs[context.aabbCount++] = aabb; }
        }
    )
);

// this exists to check if everything perfectly inlined (checking inside a test method is much more difficult...)
auto executeIndexerPipeline(Index2dContext& context, JsUtil::ResizableArray<float>& data)
{
    constexpr auto pipeline = applyFunctionFactory(TupleExt::flattenCombinations(scPIPE));
    static_assert(std::tuple_size_v<decltype(pipeline)> == 1);
    return std::get<0>(pipeline).run(context, data);
}

TEST(IntegrationTests, lineQuadIndexer)
{
    auto testData = JsUtil::ResizableArray<float>(16);
    std::iota(testData.asSpan().begin(), testData.asSpan().end(), 0);
    Index2dContext context{};
    executeIndexerPipeline(context, testData);
    ASSERT_EQ(context.aabbCount, 3);
    EXPECT_EQ(context.aabbs[0].xMin(), 2);
    EXPECT_EQ(context.aabbs[0].yMin(), 9);
    EXPECT_EQ(context.aabbs[0].xMax(), 14);
    EXPECT_EQ(context.aabbs[0].yMax(), 27);

    EXPECT_EQ(context.aabbs[1].xMin(), 10);
    EXPECT_EQ(context.aabbs[1].yMin(), 21);
    EXPECT_EQ(context.aabbs[1].xMax(), 22);
    EXPECT_EQ(context.aabbs[1].yMax(), 39);

    EXPECT_EQ(context.aabbs[2].xMin(), 18);
    EXPECT_EQ(context.aabbs[2].yMin(), 33);
    EXPECT_EQ(context.aabbs[2].xMax(), 30);
    EXPECT_EQ(context.aabbs[2].yMax(), 51);
}