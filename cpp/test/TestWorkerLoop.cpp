#include "FakeWorkerConfig.h"
#include "JsUtil/WorkerLoop.h"
#include "JsUtilTestUtil/ThreadingHelpers.h"
#include <gtest/gtest.h>

using namespace JsUtil;

TEST(WorkerLoop, sequencing)
{
    Debug::disableJsIntegration();
    auto       conf = FakeWorkerConfig{};
    WorkerLoop worker{conf};
    EXPECT_EQ(conf.m_ready_calls->load(), 0);

    worker.start();
    ASSERT_TRUE(tryVerify([&] { return *conf.m_ready_calls == 1; }));

    EXPECT_EQ(*conf.m_tick_calls, 0);
    worker.proceed();
    ASSERT_TRUE(tryVerify([&] { return *conf.m_tick_calls == 1; }));

    EXPECT_EQ(*conf.m_complete_calls, 0);
    worker.stop();
    ASSERT_TRUE(tryVerify([&] { return *conf.m_complete_calls == 1; }));
}

TEST(WorkerLoop, multipleRuns)
{
    auto       conf = FakeWorkerConfig{};
    WorkerLoop worker{conf};

    ASSERT_TRUE(worker.start());
    worker.proceed();
    ASSERT_TRUE(tryVerify([&] { return *conf.m_tick_calls == 1; }));
    worker.stop();
    ASSERT_TRUE(tryVerify([&] { return *conf.m_complete_calls == 1; }));

    ASSERT_TRUE(worker.start());
    worker.proceed();
    ASSERT_TRUE(tryVerify([&] { return *conf.m_tick_calls == 2; }));
    worker.stop();
    ASSERT_TRUE(tryVerify([&] { return *conf.m_complete_calls == 2; }));
}

TEST(WorkerLoop, cleanup)
{
    // mostly we're just looking for deadlocks, relying on ASAN to catch anything that is lost
    {
        auto       conf = FakeWorkerConfig{};
        WorkerLoop worker{conf};
    }
    {
        auto       conf = FakeWorkerConfig{};
        WorkerLoop worker{conf};
        ASSERT_TRUE(worker.start());
    }
    {
        auto       conf = FakeWorkerConfig{};
        WorkerLoop worker{conf};
        ASSERT_TRUE(worker.start());
        ASSERT_TRUE(tryVerify([&] { return *conf.m_ready_calls == 1; }));
    }
}
