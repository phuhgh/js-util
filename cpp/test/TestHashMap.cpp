#include "JsUtil/FixedHashMap.hpp"
#include "JsUtil/HashMap.hpp"
#include "JsUtil/Number.hpp"
#include "JsUtilTestUtil/MoveOnlyTestObject.hpp"
#include <JsUtilTestUtil/DisableJsIntegration.hpp>
#include <gmock/gmock-matchers.h>
#include <gtest/gtest.h>

[[maybe_unused]] static DisableJsIntegration const scDISABLE_JS_INTEGRATION;

TEST(FixedHashMap, insert)
{
    JsUtil::FixedHashMap<int, std::string, 7> map;
    bool                                      inserted = map.insert(1, "value1");
    EXPECT_TRUE(inserted);
}

TEST(FixedHashMap, find)
{
    JsUtil::FixedHashMap<int, std::string, 7> map;
    map.insert(1, "value1");
    auto c_value = map.find(1);
    ASSERT_NE(c_value, nullptr);
    EXPECT_EQ(*c_value, "value1");
}

TEST(FixedHashMap, findMissing)
{
    JsUtil::FixedHashMap<int, std::string, 7> map;
    auto                                      c_value = map.find(2);
    ASSERT_EQ(c_value, nullptr);
}

TEST(FixedHashMap, insertDuplicate)
{
    JsUtil::FixedHashMap<int, std::string, 7> map;
    map.insert(1, "initialValue");
    bool inserted = map.insert(1, "newValue");
    EXPECT_TRUE(inserted);
    auto c_value = map.find(1);
    ASSERT_NE(c_value, nullptr);
    EXPECT_EQ(*c_value, "newValue");
}

TEST(FixedHashMap, fullInsert)
{
    JsUtil::FixedHashMap<int, std::string, 2> map;
    EXPECT_NE(map.insert(1, "value1"), nullptr);
    EXPECT_NE(map.insert(2, "value2"), nullptr);
    EXPECT_EQ(map.insert(3, "value3"), nullptr);
}

TEST(FixedHashMap, insertCollision)
{
    struct NoHash
    {
        size_t operator()(int const&) const { return 0; }
    };

    // just to try it out...
    constexpr auto nextPrime = JsUtil::nextPrime(6u);
    static_assert(nextPrime == 7);

    JsUtil::FixedHashMap<int, std::string, nextPrime, NoHash> map;
    EXPECT_NE(map.insert(1, "value1"), nullptr);
    EXPECT_NE(map.insert(6, "value6"), nullptr);
    auto c_value1 = map.find(1);
    auto c_value6 = map.find(6);

    ASSERT_NE(c_value1, nullptr);
    EXPECT_EQ(*c_value1, "value1");

    ASSERT_NE(c_value6, nullptr);
    EXPECT_EQ(*c_value6, "value6");
}

TEST(FixedHashMap, erase)
{
    JsUtil::FixedHashMap<int, std::string, 7> map;
    map.insert(1, "value1");
    EXPECT_TRUE(map.erase(1));
    auto* c_value = map.find(1);
    EXPECT_EQ(c_value, nullptr);
    EXPECT_FALSE(map.erase(2));
}

TEST(FixedHashMap, findNoCopy)
{
    JsUtil::FixedHashMap<int, MoveOnlyTestObject, 7> map;
    map.insert(1, MoveOnlyTestObject{11});
    auto* c_v1 = map.find(1);
    ASSERT_NE(c_v1, nullptr);
    EXPECT_EQ(c_v1->m_val, 11);

    // ensure the const overload actually compiles
    auto const& map2 = map;
    auto*       c_v2 = map2.find(1);
    ASSERT_NE(c_v2, nullptr);
    EXPECT_EQ(c_v2->m_val, 11);
}

TEST(HashMap, overloads)
{
    JsUtil::HashMap<int, std::string> copy;

    {
        std::string                       tmp = "value1";
        JsUtil::HashMap<int, std::string> map{3};
        EXPECT_TRUE(map.insert(1, tmp));
        EXPECT_TRUE(map.insert(2, "value2"));
        EXPECT_TRUE(map.insert(3, "value3"));
        copy = map;
    }

    EXPECT_EQ(copy.size(), 3);

    auto moved = std::move(copy);
    EXPECT_EQ(moved.size(), 3);

    auto movedByCtor = JsUtil::HashMap{std::move(moved)};
    EXPECT_EQ(movedByCtor.size(), 3);

    auto CopyyCtor = JsUtil::HashMap{movedByCtor};
    EXPECT_EQ(movedByCtor.size(), 3);
    EXPECT_EQ(*movedByCtor.find(1), "value1");
    EXPECT_EQ(*movedByCtor.find(2), "value2");
    EXPECT_EQ(*movedByCtor.find(3), "value3");
}

TEST(HashMap, insert)
{
    JsUtil::HashMap<int, std::string> map{3};
    ASSERT_EQ(map.capacity(), 3);
    ASSERT_EQ(map.size(), 0);
    EXPECT_TRUE(map.insert(1, "value1"));
    EXPECT_TRUE(map.insert(2, "value2"));
    EXPECT_TRUE(map.insert(3, "value3"));
    EXPECT_TRUE(map.insert(4, "value4"));
    EXPECT_TRUE(map.insert(5, "value5"));
    ASSERT_EQ(map.capacity(), 7);
    EXPECT_TRUE(map.insert(6, "value6"));
    ASSERT_EQ(map.capacity(), 17);

    ASSERT_EQ(map.size(), 6);
    EXPECT_EQ(*map.find(1), "value1");
    EXPECT_EQ(*map.find(2), "value2");
    EXPECT_EQ(*map.find(3), "value3");
    EXPECT_EQ(*map.find(4), "value4");
    EXPECT_EQ(*map.find(5), "value5");
    EXPECT_EQ(*map.find(6), "value6");
}

TEST(HashMap, find)
{
    JsUtil::HashMap<int, std::string> map;
    map.insert(1, "value1");
    auto c_value = map.find(1);
    ASSERT_NE(c_value, nullptr);
    EXPECT_EQ(*c_value, "value1");
}

TEST(HashMap, findMissing)
{
    JsUtil::HashMap<int, std::string> map;
    auto                              c_value = map.find(2);
    ASSERT_EQ(c_value, nullptr);
}

TEST(HashMap, insertDuplicate)
{
    JsUtil::HashMap<int, std::string> map;
    map.insert(1, "initialValue");
    bool inserted = map.insert(1, "newValue");
    EXPECT_TRUE(inserted);
    auto c_value = map.find(1);
    ASSERT_NE(c_value, nullptr);
    EXPECT_EQ(*c_value, "newValue");
}

TEST(HashMap, insertCollision)
{
    struct NoHash
    {
        size_t operator()(int const&) const { return 0; }
    };

    JsUtil::HashMap<int, std::string, NoHash> map;
    EXPECT_NE(map.insert(1, "value1"), nullptr);
    EXPECT_NE(map.insert(6, "value6"), nullptr);
    auto c_value1 = map.find(1);
    auto c_value6 = map.find(6);

    ASSERT_NE(c_value1, nullptr);
    EXPECT_EQ(*c_value1, "value1");

    ASSERT_NE(c_value6, nullptr);
    EXPECT_EQ(*c_value6, "value6");
}

TEST(HashMap, erase)
{
    JsUtil::HashMap<int, std::string> map;
    map.insert(1, "value1");
    EXPECT_TRUE(map.erase(1));
    auto c_value = map.find(1);
    EXPECT_EQ(c_value, nullptr);
    EXPECT_FALSE(map.erase(2));
}

TEST(HashMap, findNoCopy)
{
    JsUtil::HashMap<int, MoveOnlyTestObject> map;
    map.insert(1, MoveOnlyTestObject{11});
    auto c_v1 = map.find(1);
    ASSERT_NE(c_v1, nullptr);
    EXPECT_EQ(c_v1->m_val, 11);

    // ensure the const overload actually compiles
    auto const& map2 = map;
    auto        c_v2 = map2.find(1);
    ASSERT_NE(c_v2, nullptr);
    EXPECT_EQ(c_v2->m_val, 11);
}