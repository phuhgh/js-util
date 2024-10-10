#include "JsUtil/SegmentedDataView.hpp"
#include <JsUtil/Pointers.hpp>
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
    auto sa = PtrOwner{SharedArray<int>::createOne(10, true)};
    std::iota(sa->asSpan().begin(), sa->asSpan().end(), 0);

    SegmentedDataView<SharedArray<int>> dv{*sa, 2};

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

TEST(SegmentedDataView, resiableArrayCompat)
{
    auto data = ResizableArray<double>(10);
    std::iota(data.asSpan().begin(), data.asSpan().end(), 0);
    auto dataView = SegmentedDataView{data, 2};
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