#include "FakeWorkerConfig.h"
#include "JsUtil/WorkerLoop.hpp"
#include "JsUtilTestUtil/DisableJsIntegration.hpp"
#include "JsUtilTestUtil/ThreadingHelpers.hpp"
#include <gtest/gtest.h>

using namespace JsUtil;

[[maybe_unused]] static DisableJsIntegration const scDISABLE_JS_INTEGRATION;

TEST(WorkerLoop, sequencing)
{
    auto       conf = FakeWorkerConfig{};
    WorkerLoop worker{conf};
    EXPECT_EQ(conf.m_ready_calls->load(), 0);

    ASSERT_TRUE(worker.start());
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

TEST(WorkerLoop, tickOnStart)
{
    auto       conf = FakeWorkerConfig{};
    WorkerLoop worker{conf};
    EXPECT_EQ(conf.m_ready_calls->load(), 0);
    ASSERT_TRUE(worker.start(true));
    EXPECT_TRUE(tryVerify([&] { return *conf.m_ready_calls == 1; }));
}

TEST(WorkerLoop, stopAndWait)
{
    auto       conf = FakeWorkerConfig{};
    WorkerLoop worker{conf};
    EXPECT_EQ(conf.m_ready_calls->load(), 0);

    ASSERT_TRUE(worker.start());
    EXPECT_EQ(*conf.m_tick_calls, 0);
    worker.proceed();

    EXPECT_EQ(*conf.m_complete_calls, 0);
    worker.stop(true);
    EXPECT_EQ(*conf.m_complete_calls, 1);
}

TEST(WorkerLoop, multipleStart)
{
    auto       conf = FakeWorkerConfig{};
    WorkerLoop worker{conf};
    EXPECT_EQ(conf.m_ready_calls->load(), 0);

    // it's daft, but it just needs to not deadlock
    ASSERT_TRUE(worker.start());
    worker.start();
    worker.start();
    worker.start();
    worker.start();
    worker.start();

    EXPECT_EQ(*conf.m_tick_calls, 0);
    worker.proceed();
    EXPECT_TRUE(tryVerify([&] { return *conf.m_tick_calls== 1; }));
    worker.stop(true);
}
