#include "JsUtil/SegmentedDataView.hpp"
#include <JsUtil/ResizableArray.hpp>
#include <JsUtil/SharedArray.hpp>
#include <JsUtil/Vec2.hpp>
#include <JsUtil/VectorUtil.hpp>
#include <JsUtilTestUtil/DisableJsIntegration.hpp>
#include <gtest/gtest.h>
#include <numeric>

[[maybe_unused]] static DisableJsIntegration const scDISABLE_JS_INTEGRATION;

using namespace JsUtil;

TEST(SegmentedDataView, sharedArrayCompat)
{
    auto sa = SharedArray<int>::createOne(10, true);
    std::iota(sa.asSpan().begin(), sa.asSpan().end(), 0);
    SegmentedDataView dv{sa, {.blockSize = 2}};

    EXPECT_EQ(dv.getLength(), 5);
    for (auto i : VectorExt::range(5))
    {
        auto block = dv.getBlock(i);
        EXPECT_EQ(block.size(), 2);
        EXPECT_EQ(block[0], i * 2);
        EXPECT_EQ(block[1], i * 2 + 1);
        block[0] *= 2;
        block[1] *= 2;
    }
    for (auto i : VectorExt::range(5))
    {
        auto block = dv.getBlock(i);
        EXPECT_EQ(block[0], i * 4);
        EXPECT_EQ(block[1], (i * 2 + 1) * 2);
    }
}

TEST(SegmentedDataView, resizableArrayCompat)
{
    auto data = ResizableArray<double>(10);
    std::iota(data.asSpan().begin(), data.asSpan().end(), 0);
    auto dataView = SegmentedDataView{data, {.blockSize = 2}};
    static_assert(std::is_same_v<ResizableArray<int>::size_type, unsigned int>);
    static_assert(std::is_same_v<ResizableArray<int>::value_type, int>);
    static_assert(std::is_same_v<decltype(dataView)::size_type, unsigned int>);

    EXPECT_EQ(dataView.getLength(), 5);
    for (auto i : VectorExt::range(5))
    {
        auto block = dataView.getBlock(i);
        EXPECT_EQ(block.size(), 2);
        EXPECT_EQ(block[0], i * 2);
        EXPECT_EQ(block[1], i * 2 + 1);
        block[0] *= 2;
        block[1] *= 2;
    }
    for (auto i : VectorExt::range(5))
    {
        auto block = dataView.getBlock(i);
        EXPECT_EQ(block[0], i * 4);
        EXPECT_EQ(block[1], (i * 2 + 1) * 2);
    }
}

TEST(SegmentedDataView, strideOffset)
{
    auto data = ResizableArray<double>(10);
    std::iota(data.asSpan().begin(), data.asSpan().end(), 0);
    auto dataView = SegmentedDataView{data, {.blockSize = 1, .stride = 2, .offset = 1}};

    EXPECT_EQ(dataView.getLength(), 4);

    auto block = dataView.getBlock(0);
    EXPECT_EQ(block.size(), 1);
    EXPECT_EQ(block[0], 1);

    EXPECT_EQ(dataView.getBlock(1)[0], 3);
    EXPECT_EQ(dataView.getBlock(2)[0], 5);
    EXPECT_EQ(dataView.getBlock(3)[0], 7);
    EXPECT_EQ(dataView.getBlock(4)[0], 9);
}

TEST(SegmentedDataView, mapIndex)
{
    auto data = ResizableArray<double>(10);
    std::iota(data.asSpan().begin(), data.asSpan().end(), 0);
    auto dataView = SegmentedDataView{data, {.blockSize = 1, .stride = 2, .offset = 1}};

    EXPECT_EQ(dataView.getLength(), 4);

    Vec2<double> v1 =
        dataView.mapBlock(0, [](auto const& segment, auto const&) { return Vec2<double>{{segment[0], segment[1]}}; });
    Vec2<double> v2 =
        dataView.mapBlock(1, [](auto const& segment, auto const&) { return Vec2<double>{{segment[0], segment[1]}}; });
    EXPECT_EQ(v1.x(), 1); // (offset of 1...)
    EXPECT_EQ(v1.y(), 2);
    EXPECT_EQ(v2.x(), 3);
    EXPECT_EQ(v2.y(), 4);
}

TEST(SegmentedDataView, getLength)
{
    auto empty = ResizableArray<double>(0);
    auto emptyDv = SegmentedDataView{empty, {.blockSize = 2, .offset = 2}};
    EXPECT_EQ(emptyDv.getLength(), 0);

    // useful for interpreting a buffer of points as e.g. a line
    // 4 points of size 4 (1 removed because of offset)
    auto data = ResizableArray<double>(16);
    std::iota(data.asSpan().begin(), data.asSpan().end(), 0);
    auto dataView = SegmentedDataView{data, {.blockSize = 8, .stride = 4, .offset = 1}};
    ASSERT_EQ(dataView.getLength(), 2);

    auto b1 = dataView.getBlock(0);
    ASSERT_EQ(b1.size(), 8);
    EXPECT_EQ(b1[0], 1);
    EXPECT_EQ(b1[1], 2);
    EXPECT_EQ(b1[2], 3);
    EXPECT_EQ(b1[3], 4);
    EXPECT_EQ(b1[4], 5);
    EXPECT_EQ(b1[5], 6);
    EXPECT_EQ(b1[6], 7);
    EXPECT_EQ(b1[7], 8);

    auto b2 = dataView.getBlock(1);
    ASSERT_EQ(b2.size(), 8);
    EXPECT_EQ(b2[0], 5);
    EXPECT_EQ(b2[1], 6);
    EXPECT_EQ(b2[2], 7);
    EXPECT_EQ(b2[3], 8);
    EXPECT_EQ(b2[4], 9);
    EXPECT_EQ(b2[5], 10);
    EXPECT_EQ(b2[6], 11);
    EXPECT_EQ(b2[7], 12);
}