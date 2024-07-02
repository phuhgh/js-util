#include "JsUtil/CircularBuffer.h"
#include "JsUtilTestUtil/MoveOnlyTestObject.h"
#include <gtest/gtest.h>

using namespace JsUtil;

TEST(TestCircularBuffer, insideInputRange) {
    CircularBuffer<int> buffer({0, 1, 2, 3});

    EXPECT_EQ(buffer[0], 0);
    EXPECT_EQ(buffer[3], 3);
}

TEST(TestCircularBuffer, goingForwardPastEnd) {
    CircularBuffer<int> buffer({0, 1, 2, 3});

    EXPECT_EQ(buffer[4], 0);
    EXPECT_EQ(buffer[7], 3);
    EXPECT_EQ(buffer[8], 0);
}

TEST(TestCircularBuffer, goingBackwardPastStart) {
    CircularBuffer<int> buffer({0, 1, 2, 3});

    // it's possible, I'm not saying it's a good idea...
    EXPECT_EQ(buffer[-1], 3);
    EXPECT_EQ(buffer[-2], 2);
    EXPECT_EQ(buffer[-3], 1);
    EXPECT_EQ(buffer[-4], 0);
    EXPECT_EQ(buffer[-5], 3);
}

TEST(TestCircularBuffer, writingBasic) {
    CircularBuffer<int> buffer(5);

    for (int i = 0; i < 100; ++i) {
        buffer[i] = i;
    }

    EXPECT_EQ(buffer[0], 95);
    EXPECT_EQ(buffer[1], 96);
    EXPECT_EQ(buffer[2], 97);
    EXPECT_EQ(buffer[3], 98);
    EXPECT_EQ(buffer[4], 99);
}

TEST(TestCircularBuffer, moveOnlyElementSupport) {
    CircularBuffer<MoveOnlyTestObject> buffer(5);

    for (int i = 0; i < 100; ++i) {
        // not important how we got the object, only that we can put it in the buffer and know that
        // it didn't copy
        MoveOnlyTestObject tmp {i};
        buffer[i] = std::move(tmp);
    }

    // how the language is supposed to work, but doesn't hurt to check...
    const auto& val = buffer[0];
    EXPECT_EQ(val.m_val, 95);

    EXPECT_EQ(buffer[0].m_val, 95);
    EXPECT_EQ(buffer[1].m_val, 96);
    EXPECT_EQ(buffer[2].m_val, 97);
    EXPECT_EQ(buffer[3].m_val, 98);
    EXPECT_EQ(buffer[4].m_val, 99);
}