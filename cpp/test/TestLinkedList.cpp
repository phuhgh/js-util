#include "JsUtil/LinkedList.hpp"
#include "JsUtilTestUtil/TestObjects.hpp"
#include <JsUtilTestUtil/DisableJsIntegration.hpp>
#include <gtest/gtest.h>

[[maybe_unused]] static DisableJsIntegration const scDISABLE_JS_INTEGRATION;

using namespace JsUtil;

TEST(LinkedList, moveOverloads)
{
    LinkedList<MoveOnlyTestObject> list;
    ASSERT_TRUE(list.append(MoveOnlyTestObject(1)));
    ASSERT_TRUE(list.append(MoveOnlyTestObject(2)));
    EXPECT_EQ(list.head()->data.m_val, 1);
    EXPECT_EQ(list.tail()->data.m_val, 2);
    EXPECT_EQ(list.head()->next, list.tail());
    EXPECT_EQ(list.tail()->next, nullptr);
}

TEST(LinkedList, appendElements)
{
    LinkedList<MoveOnlyTestObject> list;
    EXPECT_TRUE(list.empty());
    ASSERT_TRUE(list.append(MoveOnlyTestObject(1)));
    ASSERT_TRUE(list.append(MoveOnlyTestObject(2)));
    EXPECT_EQ(list.head()->data.m_val, 1);
    EXPECT_EQ(list.tail()->data.m_val, 2);
    EXPECT_EQ(list.head()->next, list.tail());
    EXPECT_EQ(list.tail()->next, nullptr);
    EXPECT_FALSE(list.empty());
}

TEST(LinkedList, prependElements)
{
    LinkedList<MoveOnlyTestObject> list;
    ASSERT_TRUE(list.prepend(MoveOnlyTestObject(1)));
    ASSERT_TRUE(list.prepend(MoveOnlyTestObject(2)));
    EXPECT_EQ(list.head()->data.m_val, 2);
    EXPECT_EQ(list.tail()->data.m_val, 1);
    EXPECT_EQ(list.head()->next, list.tail());
    EXPECT_EQ(list.tail()->next, nullptr);
}

TEST(LinkedList, contains)
{
    LinkedList<MoveOnlyTestObject> list;
    list.append(MoveOnlyTestObject(1));
    list.append(MoveOnlyTestObject(2));
    EXPECT_TRUE(list.contains(MoveOnlyTestObject(1)));
    EXPECT_FALSE(list.contains(MoveOnlyTestObject(3)));
}

TEST(LinkedList, eraseStart)
{
    LinkedList<MoveOnlyTestObject> list;
    list.append(MoveOnlyTestObject(1));
    list.append(MoveOnlyTestObject(2));

    EXPECT_TRUE(list.erase(MoveOnlyTestObject(1)));

    EXPECT_FALSE(list.contains(MoveOnlyTestObject(1)));
    EXPECT_EQ(list.head()->data.m_val, 2);
    EXPECT_EQ(list.tail()->data.m_val, 2);
}

TEST(LinkedList, eraseMiddle)
{
    LinkedList<MoveOnlyTestObject> list;
    list.append(MoveOnlyTestObject(1));
    list.append(MoveOnlyTestObject(2));
    list.append(MoveOnlyTestObject(3));

    EXPECT_TRUE(list.erase(MoveOnlyTestObject(2)));

    EXPECT_FALSE(list.contains(MoveOnlyTestObject(2)));
    EXPECT_EQ(list.head()->data.m_val, 1);
    EXPECT_EQ(list.tail()->data.m_val, 3);
}

TEST(LinkedList, eraseEnd)
{
    LinkedList<MoveOnlyTestObject> list;
    list.append(MoveOnlyTestObject(1));
    list.append(MoveOnlyTestObject(2));

    EXPECT_TRUE(list.erase(MoveOnlyTestObject(2)));

    EXPECT_FALSE(list.contains(MoveOnlyTestObject(2)));
    EXPECT_EQ(list.head()->data.m_val, 1);
    EXPECT_EQ(list.tail()->data.m_val, 1);
}

class LinkedListBoilerplate : public ::testing::Test
{
  protected:
    LinkedList<int> createList()
    {
        LinkedList<int> list;
        list.append(10);
        list.append(20);
        list.append(30);
        return list;
    }
};

TEST_F(LinkedListBoilerplate, MoveConstructor)
{
    LinkedList<int> list1 = createList();
    LinkedList<int> list2 = std::move(list1);

    EXPECT_TRUE(list1.empty());

    EXPECT_FALSE(list2.empty());
    EXPECT_EQ(list2.head()->data, 10);
    EXPECT_EQ(list2.tail()->data, 30);
}

TEST_F(LinkedListBoilerplate, MoveConstructorEmpty)
{
    LinkedList<int> list1;
    LinkedList<int> list2 = std::move(list1);

    EXPECT_TRUE(list1.empty());

    EXPECT_TRUE(list2.empty());
}

TEST_F(LinkedListBoilerplate, MoveAssignment)
{
    LinkedList<int> list1 = createList();
    LinkedList<int> list2;
    list2 = std::move(list1);

    EXPECT_TRUE(list1.empty());

    EXPECT_FALSE(list2.empty());
    EXPECT_EQ(list2.head()->data, 10);
    EXPECT_EQ(list2.tail()->data, 30);
}

TEST_F(LinkedListBoilerplate, MoveAssignmentSelfAssignment)
{
    LinkedList<int> list1 = createList();
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wself-move"
    // ReSharper disable once CppIdenticalOperandsInBinaryExpression
    list1 = std::move(list1);
#pragma clang diagnostic pop

    EXPECT_FALSE(list1.empty());
    EXPECT_EQ(list1.head()->data, 10);
    EXPECT_EQ(list1.tail()->data, 30);
    EXPECT_EQ(list1.size(), 3);
}

TEST_F(LinkedListBoilerplate, CopyConstructor)
{
    LinkedList<int> list1 = createList();
    LinkedList<int> list2 = list1;

    ASSERT_FALSE(list1.empty());
    ASSERT_FALSE(list2.empty());
    EXPECT_EQ(list1.head()->data, list2.head()->data);
    EXPECT_EQ(list1.tail()->data, list2.tail()->data);
    EXPECT_NE(list1.head(), list2.head());
    EXPECT_NE(list1.tail(), list2.tail());

    list2.append(40);
    EXPECT_EQ(list1.size(), 3);
    EXPECT_EQ(list2.size(), 4);
}

TEST_F(LinkedListBoilerplate, CopyAssignment)
{
    LinkedList<int> list1 = createList();
    LinkedList<int> list2;
    list2 = list1;

    ASSERT_FALSE(list1.empty());
    ASSERT_FALSE(list2.empty());
    EXPECT_EQ(list1.head()->data, list2.head()->data);
    EXPECT_EQ(list1.tail()->data, list2.tail()->data);
    EXPECT_NE(list1.head(), list2.head());
    EXPECT_NE(list1.tail(), list2.tail());

    list2.append(40);
    EXPECT_EQ(list1.size(), 3);
    EXPECT_EQ(list2.size(), 4);
}

TEST_F(LinkedListBoilerplate, CopyAssignmentSelfAssignment)
{
    LinkedList<int> list1 = createList();
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wself-assign-overloaded"
    // ReSharper disable once CppIdenticalOperandsInBinaryExpression
    list1 = list1;
#pragma clang diagnostic pop

    EXPECT_FALSE(list1.empty());
    EXPECT_EQ(list1.head()->data, 10);
    EXPECT_EQ(list1.tail()->data, 30);
    EXPECT_EQ(list1.size(), 3);
}