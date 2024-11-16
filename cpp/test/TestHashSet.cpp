#include "JsUtil/HashSet.hpp"
#include <JsUtilTestUtil/DisableJsIntegration.hpp>
#include <gmock/gmock-matchers.h>
#include <gtest/gtest.h>

[[maybe_unused]] static DisableJsIntegration const scDISABLE_JS_INTEGRATION;

TEST(HashSet, insert)
{
    JsUtil::HashSet<int> s; // default ctor (59)
    s.insert(1);
    s.insert(3);
    EXPECT_FALSE(s.contains(0));
    EXPECT_TRUE(s.contains(1));
    EXPECT_FALSE(s.contains(2));
    EXPECT_TRUE(s.contains(3));
    EXPECT_EQ(s.capacity(), 59);
    EXPECT_EQ(s.size(), 2);

    JsUtil::HashSet<int> small{4};
    EXPECT_EQ(small.capacity(), 4);
    EXPECT_EQ(small.size(), 0);
    EXPECT_TRUE(small.insert(0));
    EXPECT_FALSE(small.insert(0));
    EXPECT_EQ(small.size(), 1);
    small.insert(1);
    small.insert(2);
    EXPECT_EQ(small.capacity(), 4);
    small.insert(3);
    EXPECT_EQ(small.capacity(), 17);
    EXPECT_EQ(small.size(), 4);
}

TEST(HashSet, erase)
{
    JsUtil::HashSet<int> hashSet;

    hashSet.insert(1);
    EXPECT_TRUE(hashSet.contains(1));
    EXPECT_TRUE(hashSet.erase(1));
    EXPECT_FALSE(hashSet.contains(1));
    EXPECT_EQ(hashSet.size(), 0);

    EXPECT_FALSE(hashSet.erase(2));
    EXPECT_EQ(hashSet.size(), 0);
}

TEST(HashSet, useAfterRehash)
{
    JsUtil::HashSet<int> hashSet(3);

    for (int i = 0; i < 10; ++i)
    {
        hashSet.insert(i);
        EXPECT_TRUE(hashSet.contains(i));
    }

    EXPECT_EQ(hashSet.size(), 10);

    for (int i = 0; i < 10; ++i)
    {
        EXPECT_TRUE(hashSet.contains(i));
        hashSet.erase(i);
        EXPECT_FALSE(hashSet.contains(i));
    }

    EXPECT_EQ(hashSet.size(), 0);
}

TEST(HashSet, move)
{
    JsUtil::HashSet<int> hashSet;

    hashSet.insert(4);
    JsUtil::HashSet<int> movedHashSet(std::move(hashSet));

    EXPECT_TRUE(movedHashSet.contains(4));
    EXPECT_EQ(movedHashSet.size(), 1);

    JsUtil::HashSet<int> assigned = std::move(movedHashSet);

    EXPECT_TRUE(assigned.contains(4));
    EXPECT_EQ(assigned.size(), 1);
}