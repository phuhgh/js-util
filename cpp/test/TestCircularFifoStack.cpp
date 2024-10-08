#include "JsUtil/CircularFifoStack.hpp"
#include "JsUtilTestUtil/MoveOnlyTestObject.hpp"
#include <JsUtilTestUtil/DisableJsIntegration.hpp>
#include <gtest/gtest.h>

[[maybe_unused]] static DisableJsIntegration const scDISABLE_JS_INTEGRATION;

using namespace JsUtil;

TEST(TestCircularFIFOStack, statusMethods)
{
    CircularFIFOStack<int, ECircularStackOverflowMode::DebugException> stack(4);
    EXPECT_TRUE(stack.getIsEmpty());
    EXPECT_EQ(stack.getRemainingCapacity(), 4);
    EXPECT_EQ(stack.getElementCount(), 0);
    stack.push(1);
    EXPECT_FALSE(stack.getIsEmpty());
    EXPECT_EQ(stack.getElementCount(), 1);
    EXPECT_EQ(stack.getRemainingCapacity(), 3);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    EXPECT_EQ(stack.getElementCount(), 4);
    EXPECT_EQ(stack.getRemainingCapacity(), 0);
    stack.pop();
    stack.pop();
    stack.pop();
    stack.pop();
    EXPECT_TRUE(stack.getIsEmpty());
}

TEST(TestCircularFIFOStack, pop)
{
    CircularFIFOStack<int, ECircularStackOverflowMode::DebugException> stack(4);
    stack.push(1);
    stack.push(2);
    EXPECT_EQ(stack[0], 1);
    EXPECT_EQ(stack[1], 2);
    EXPECT_EQ(stack.pop(), 1);
    EXPECT_EQ(stack.pop(), 2);

    stack.push(3);
    stack.push(4);
    EXPECT_EQ(stack[0], 3);
    EXPECT_EQ(stack[1], 4);
    EXPECT_EQ(stack.pop(), 3);
    EXPECT_EQ(stack.pop(), 4);

    stack.push(5);
    stack.push(6);
    EXPECT_EQ(stack[0], 5);
    EXPECT_EQ(stack[1], 6);
    EXPECT_EQ(stack.pop(), 5);
    EXPECT_EQ(stack.pop(), 6);
}

TEST(TestCircularFIFOStack, pushGrow)
{
    CircularFIFOStack<int, ECircularStackOverflowMode::Grow> stack(4);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    EXPECT_EQ(stack[0], 1);
    EXPECT_EQ(stack[1], 2);
    EXPECT_EQ(stack[2], 3);
    EXPECT_EQ(stack[3], 4);
    EXPECT_EQ(stack.getCapacity(), 4);

    stack.push(5);
    EXPECT_EQ(stack[0], 1);
    EXPECT_EQ(stack[1], 2);
    EXPECT_EQ(stack[2], 3);
    EXPECT_EQ(stack[3], 4);
    EXPECT_EQ(stack[4], 5);
    EXPECT_EQ(stack.getCapacity(), 8);
    EXPECT_EQ(stack.pop(), 1);
    EXPECT_EQ(stack.pop(), 2);
    EXPECT_EQ(stack.pop(), 3);
    EXPECT_EQ(stack.pop(), 4);
    EXPECT_EQ(stack.pop(), 5);
    EXPECT_TRUE(stack.getIsEmpty());
}

TEST(TestCircularFIFOStack, pushNoOp)
{
    CircularFIFOStack<int, ECircularStackOverflowMode::NoOp> stack(4);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    EXPECT_TRUE(stack.push(4));
    EXPECT_EQ(stack.getCapacity(), 4);
    EXPECT_FALSE(stack.push(5));
    EXPECT_EQ(stack.getCapacity(), 4);
    EXPECT_EQ(stack.pop(), 1);
    EXPECT_EQ(stack.pop(), 2);
    EXPECT_EQ(stack.pop(), 3);
    EXPECT_EQ(stack.pop(), 4);
    EXPECT_TRUE(stack.getIsEmpty());
}

TEST(TestCircularFIFOStack, overflowModeDebugException)
{
    Debug::setDebugDisabled(true);
    CircularFIFOStack<int, ECircularStackOverflowMode::DebugException> stack(4);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    EXPECT_EQ(stack.getCapacity(), 4);

    // this should fail to push
    stack.push(5);

    EXPECT_EQ(stack.getCapacity(), 4);
    EXPECT_EQ(stack.pop(), 1);
    EXPECT_EQ(stack.pop(), 2);
    EXPECT_EQ(stack.pop(), 3);
    EXPECT_EQ(stack.pop(), 4);
    EXPECT_TRUE(stack.getIsEmpty());
    Debug::setDebugDisabled(false);
}

TEST(TestCircularFIFOStack, overflowModeOverwrite)
{
    CircularFIFOStack<int, ECircularStackOverflowMode::Overwrite> stack(4);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    EXPECT_EQ(stack.push(4), std::nullopt);
    EXPECT_EQ(stack.getCapacity(), 4);
    EXPECT_EQ(stack.push(5), 1);
    EXPECT_EQ(stack.getCapacity(), 4);
    EXPECT_EQ(stack.pop(), 2);
    EXPECT_EQ(stack.pop(), 3);
    EXPECT_EQ(stack.pop(), 4);
    EXPECT_EQ(stack.pop(), 5);
    EXPECT_TRUE(stack.getIsEmpty());
}

TEST(TestCircularFIFOStack, moveOnlyElementSupport)
{
    CircularFIFOStack<MoveOnlyTestObject, ECircularStackOverflowMode::DebugException> dStack(4);
    dStack.push(MoveOnlyTestObject{1});
    auto dVal = dStack.pop();
    EXPECT_EQ(dVal.m_val, 1);

    CircularFIFOStack<MoveOnlyTestObject, ECircularStackOverflowMode::Overwrite> oStack(4);
    oStack.push(MoveOnlyTestObject{2});
    auto oVal = oStack.pop();
    EXPECT_EQ(oVal.m_val, 2);

    CircularFIFOStack<MoveOnlyTestObject, ECircularStackOverflowMode::Grow> gStack(4);
    gStack.push(MoveOnlyTestObject{3});
    auto gVal = gStack.pop();
    EXPECT_EQ(gVal.m_val, 3);

    CircularFIFOStack<MoveOnlyTestObject, ECircularStackOverflowMode::NoOp> nStack(4);
    nStack.push(MoveOnlyTestObject{4});
    auto nVal = nStack.pop();
    EXPECT_EQ(nVal.m_val, 4);
}

TEST(TestCircularFIFOStack, atomicPushPop)
{
    CircularFIFOStack<MoveOnlyTestObject, ECircularStackOverflowMode::DebugException, unsigned, std::atomic<unsigned>>
        dStack(4);
    dStack.push(MoveOnlyTestObject{1});
    EXPECT_EQ(dStack.pop().m_val, 1);

    CircularFIFOStack<MoveOnlyTestObject, ECircularStackOverflowMode::NoOp, unsigned, std::atomic<unsigned>> nStack(4);
    nStack.push(MoveOnlyTestObject{4});
    EXPECT_EQ(nStack.pop().m_val, 4);
}

TEST(TestCircularFIFOStack, atomicAbsoluteIndexes)
{
    CircularFIFOStack<int, ECircularStackOverflowMode::NoOp, unsigned, std::atomic<unsigned>> nStack(4);
    EXPECT_EQ(nStack.getAbsoluteStart(), 0);
    EXPECT_EQ(nStack.getAbsoluteEnd(), 0);
}

TEST(TestCircularFIFOStack, absoluteIndexes)
{
    CircularFIFOStack<int, ECircularStackOverflowMode::NoOp, unsigned> nStack(4);
    EXPECT_EQ(nStack.getAbsoluteStart(), 0);
    EXPECT_EQ(nStack.getAbsoluteEnd(), 0);
}
