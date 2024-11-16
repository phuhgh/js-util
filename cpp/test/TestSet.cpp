#include "JsUtil/HashSet.hpp"
#include "JsUtilTestUtil/MoveOnlyTestObject.hpp"
#include <JsUtilTestUtil/DisableJsIntegration.hpp>
#include <gtest/gtest.h>

[[maybe_unused]] static DisableJsIntegration const scDISABLE_JS_INTEGRATION;

using namespace JsUtil;

TEST(HashSet, insertion)
{
    auto                        v = MoveOnlyTestObject{1};
    HashSet<MoveOnlyTestObject> set;
    EXPECT_TRUE(set.insert(MoveOnlyTestObject{1}));
    EXPECT_TRUE(set.contains(v));
    EXPECT_FALSE(set.contains(MoveOnlyTestObject{2}));
}

TEST(HashSet, insertDuplicate)
{
    HashSet<MoveOnlyTestObject> set;
    MoveOnlyTestObject          obj1(1);

    EXPECT_TRUE(set.insert(std::move(obj1)));
    EXPECT_FALSE(set.insert(MoveOnlyTestObject(1)));
}

TEST(HashSet, eraseElement)
{
    HashSet<MoveOnlyTestObject> set;

    set.insert(MoveOnlyTestObject(1));
    EXPECT_TRUE(set.contains(MoveOnlyTestObject(1)));
    EXPECT_TRUE(set.erase(MoveOnlyTestObject(1)));
    EXPECT_FALSE(set.contains(MoveOnlyTestObject(1)));
}

TEST(HashSet, eraseNonExistentElement)
{
    HashSet<MoveOnlyTestObject> set;
    EXPECT_FALSE(set.erase(MoveOnlyTestObject(1)));
}

TEST(HashSet, insertCausingResize)
{
    HashSet<MoveOnlyTestObject> set(3);
    for (int i = 0; i < 10; ++i)
    {
        set.insert(MoveOnlyTestObject(i));
    }
    for (int i = 0; i < 10; ++i)
    {
        EXPECT_TRUE(set.contains(MoveOnlyTestObject(i)));
    }
}
