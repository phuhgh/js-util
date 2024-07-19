#include "JsUtil/Debug.h"
#include <gtest/gtest.h>

using namespace JsUtil;

TEST(Debug, runBlock)
{
    // it's run in debug and not release - both tests are run on CI...
    int count{0};
    Debug::runBlock([&]() { ++count; });

#ifdef NDEBUG
    EXPECT_EQ(count, 0);
#else
    EXPECT_EQ(count, 1);
#endif
}

TEST(Debug, isDebug)
{
    // a slightly questionable use, but it removes a warning about not being used...
#ifdef NDEBUG
    static_assert(!Debug::isDebug());
#else
    static_assert(Debug::isDebug());
#endif
}