#include "JsUtil/SegmentedDataView.hpp"
#include <JsUtil/ResizableArray.hpp>
#include <JsUtil/SharedArray.hpp>
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