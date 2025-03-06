#include "JsUtil/HashSet.hpp"
#include <JsUtilTestUtil/DisableJsIntegration.hpp>
#include <gmock/gmock-matchers.h>
#include <gtest/gtest.h>

[[maybe_unused]] static DisableJsIntegration const scDISABLE_JS_INTEGRATION;

namespace JsUtil
{

template <typename T>
struct EqualityComparer<std::weak_ptr<T>>
{
    static bool isEqual(std::weak_ptr<T> const& lhs, std::weak_ptr<T> const rhs) { return lhs.lock() == rhs.lock(); }
};

} // namespace JsUtil

namespace std
{
template <typename T>
struct hash<std::weak_ptr<T>>
{
    std::size_t operator()(std::weak_ptr<T> const& ptr) const noexcept
    {
        return std::hash<T const*>()(ptr.lock().get());
    }
};
} // namespace std

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

TEST(HashSet, iteration)
{
    JsUtil::HashSet<int> s;

    for (auto const& _ : s)
    {
        FAIL() << "The loop should not run.";
    }

    s.insert(1);
    s.insert(3);
    s.insert(5);
    s.insert(7);
    s.insert(9);

    std::set<int>              values{};
    JsUtil::HashSet<int> const huh = s;
    for (auto const& key : huh)
    {
        values.insert(key);
    }

    EXPECT_EQ(values.size(), 5);
    EXPECT_TRUE(values.contains(1));
    EXPECT_TRUE(values.contains(3));
    EXPECT_TRUE(values.contains(5));
    EXPECT_TRUE(values.contains(7));
    EXPECT_TRUE(values.contains(9));
}

TEST(HashSet, specialization)
{
    auto                                a = std::make_shared<int>(1);
    auto                                b = std::make_shared<int>(1);
    JsUtil::HashSet<std::weak_ptr<int>> hashSet;

    hashSet.insert(a);
    EXPECT_TRUE(hashSet.contains(a));
    EXPECT_TRUE(hashSet.erase(a));
    EXPECT_FALSE(hashSet.contains(a));
    EXPECT_EQ(hashSet.size(), 0);

    EXPECT_FALSE(hashSet.erase(b));
    EXPECT_EQ(hashSet.size(), 0);
}
