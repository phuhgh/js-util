#include "JsUtil/ResizableArray.hpp"
#include "JsUtilTestUtil/CreateDestroyTestCounter.hpp"
#include <gtest/gtest.h>

using namespace JsUtil;

struct TestStructImpl
{
    TestStructImpl()
        : m_val(66)
    {
    }
    TestStructImpl(int val)
        : m_val(val)
    {
    }

    int m_val;
};

using TestStruct = CreateDestroyTestCounter<TestStructImpl>;
// todo jack: actually check the create destroy counts

extern "C" char const* __asan_default_options() // NOLINT(*-reserved-identifier)
{
    return "allocator_may_return_null=1";
}

#if !(__has_feature(address_sanitizer))
TEST(TestResizableArray, allocation)
{
    ResizableArray<char> c1(12 * 1024 * 1024);
    ResizableArray<char> c2(12 * 1024 * 1024);
    EXPECT_NE(c1.size(), 0);
    EXPECT_EQ(c2.size(), 0);
    // this code is daft, but if you don't actually use the pointer address, it optimizes the whole thing away (and does
    // so incorrectly...)
    EXPECT_NE(c1.asSpan().data(), c2.asSpan().data());
}
#endif

TEST(TestResizableArray, resizing)
{
    TestStruct::reset();
    {
        ResizableArray<TestStruct> buffer{TestStruct{0}, TestStruct{1}, TestStruct{2}, TestStruct{3}};
        EXPECT_EQ(buffer.size(), 4);
        EXPECT_EQ(buffer[0].m_val, 0);
        EXPECT_EQ(buffer[3].m_val, 3);
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 8); // 4 default, 4 move

        ASSERT_TRUE(buffer.resize(2));
        EXPECT_EQ(TestStruct::m_destroyed, 6);                // 4 from default construction, 2 from resizing
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 8); // shouldn't create anything
        EXPECT_EQ(buffer.size(), 2);
        EXPECT_EQ(buffer[0].m_val, 0);
        EXPECT_EQ(buffer[1].m_val, 1);

        ASSERT_TRUE(buffer.resize(8));
        EXPECT_EQ(TestStruct::m_destroyed, 8);                 // all default constructed + original elements
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 16); // create 8 new elements
        EXPECT_EQ(buffer[0].m_val, 0);
        EXPECT_EQ(buffer[1].m_val, 1);
        EXPECT_EQ(buffer[2].m_val, 66); // default constructor
        EXPECT_EQ(buffer.size(), 8);

        // relies on ASAN to be useful
        buffer[7].m_val = 1;
        EXPECT_EQ(buffer[7].m_val, 1);
    }

    EXPECT_EQ(TestStruct::m_destroyed, 16);
}

TEST(TestResizableArray, span)
{
    ResizableArray<TestStruct> buffer{TestStruct{0}, TestStruct{1}, TestStruct{2}, TestStruct{3}};
    auto                       span = buffer.asSpan();
    ASSERT_EQ(span.size(), 4);
    EXPECT_EQ(span[0].m_val, 0);
    EXPECT_EQ(span[3].m_val, 3);
}

TEST(TestResizableArray, zeroSize)
{
    ResizableArray<int> buffer({});
    EXPECT_EQ(buffer.size(), 0);
}

TEST(TestResizableArray, copyCtor)
{
    TestStruct::reset();
    {
        ResizableArray<TestStruct> b1{TestStruct{0}, TestStruct{1}, TestStruct{2}, TestStruct{3}};
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 8); // 4 default, 4 move
        ASSERT_EQ(b1.size(), 4);
        ASSERT_EQ(b1[3].m_val, 3);
        ResizableArray<TestStruct> b2(b1);
        auto                       s1 = b2.asSpan();
        EXPECT_EQ(s1.size(), 4);
        EXPECT_EQ(s1[0].m_val, 0);
        EXPECT_EQ(s1[3].m_val, 3);
        EXPECT_EQ(TestStruct::m_copy_constructed, 4);
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 12); // 4 default, 4 move, 4 copy
    }
    EXPECT_EQ(TestStruct::m_destroyed, 12);
}

TEST(TestResizableArray, moveCtor)
{
    TestStruct::reset();
    {
        ResizableArray<TestStruct> b1{TestStruct{0}, TestStruct{1}, TestStruct{2}, TestStruct{3}};
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 8); // 4 default, 4 move
        ResizableArray<TestStruct> b2(std::move(b1));
        auto                       s1 = b2.asSpan();
        EXPECT_EQ(s1.size(), 4);
        EXPECT_EQ(s1[0].m_val, 0);
        EXPECT_EQ(s1[3].m_val, 3);
        EXPECT_EQ(b1.size(), 0);
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 8);
    }

    EXPECT_EQ(TestStruct::m_destroyed, 8);
}

TEST(TestResizableArray, copyAssignment)
{
    TestStruct::reset();
    {
        ResizableArray<TestStruct> b1{TestStruct{0}, TestStruct{1}, TestStruct{2}, TestStruct{3}};
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 8); // 4 default, 4 move
        ASSERT_EQ(b1.size(), 4);
        ASSERT_EQ(b1[3].m_val, 3);
        ResizableArray<TestStruct> b2 = b1;
        auto                       s1 = b2.asSpan();
        EXPECT_EQ(s1.size(), 4);
        EXPECT_EQ(s1[0].m_val, 0);
        EXPECT_EQ(s1[3].m_val, 3);
        EXPECT_EQ(TestStruct::m_copy_constructed, 4);
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 12); // 4 default, 4 move, 4 copy
    }
    EXPECT_EQ(TestStruct::m_destroyed, 12);
}

TEST(TestResizableArray, moveAssignment)
{
    TestStruct::reset();
    {
        ResizableArray<TestStruct> b1{TestStruct{0}, TestStruct{1}, TestStruct{2}, TestStruct{3}};
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 8); // 4 default, 4 move
        ResizableArray<TestStruct> b2 = std::move(b1);
        auto                       s1 = b2.asSpan();
        EXPECT_EQ(s1.size(), 4);
        EXPECT_EQ(s1[0].m_val, 0);
        EXPECT_EQ(s1[3].m_val, 3);
        EXPECT_EQ(b1.size(), 0);
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 8);
    }

    EXPECT_EQ(TestStruct::m_destroyed, 8);
}

TEST(TestResizableArray, compactPointers)
{
    int                  i1{2};
    int                  i2{1};
    ResizableArray<int*> a{nullptr, &i1, nullptr, &i2, nullptr};
    a.compact();
    EXPECT_EQ(a.size(), 2);
    EXPECT_EQ(*a[0], 2);
    EXPECT_EQ(*a[1], 1);
}

TEST(TestResizableArray, createPointerArray)
{
    auto happy = ResizableArray<gsl::owner<TestStruct*>>::createPointerArray(4, []() -> gsl::owner<TestStruct*> {
        return new (std::nothrow) TestStruct{};
    });
    EXPECT_EQ(happy.size(), 4);
    for (auto* obj : happy.asSpan())
    {
        delete obj;
    }

    int  createCount{0};
    auto sad = ResizableArray<gsl::owner<TestStruct*>>::createPointerArray(4, [&]() -> gsl::owner<TestStruct*> {
        // simulate allocation failure
        if (createCount++ >= 2)
        {
            return nullptr;
        }
        else
        {
            return new (std::nothrow) TestStruct{};
        }
    });
    EXPECT_EQ(sad.size(), 2);
    for (auto* obj : sad.asSpan())
    {
        delete obj;
    }
}

TEST(TestResizableArray, spanConversion)
{
    TestStruct::reset();
    {
        ResizableArray b1{TestStruct{0}, TestStruct{1}, TestStruct{2}, TestStruct{3}};
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 8); // 4 default, 4 move
        ASSERT_EQ(b1.size(), 4);
        ASSERT_EQ(b1[3].m_val, 3);
        std::span<decltype(b1)::value_type> s1 = b1;
        EXPECT_EQ(s1.size(), 4);
        EXPECT_EQ(s1[0].m_val, 0);
        EXPECT_EQ(s1[3].m_val, 3);
        EXPECT_EQ(TestStruct::getTotalConstructedCount(), 8); // 4 default, 4 move
    }
    EXPECT_EQ(TestStruct::m_destroyed, 8);
}