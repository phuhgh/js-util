#include "FakeWorkerJob.h"
#include "JsUtil/WorkerLoop.h"
#include "JsUtilTestUtil/ThreadingHelpers.h"
#include "JsUtil/SharedArray.h"
#include <gtest/gtest.h>

using namespace JsUtil;

// todo jack: naming etc
TEST(WorkerLoop, basicFunctionality)
{
    auto       conf = std::make_shared<FakeWorkerJob>();
    WorkerLoop worker{conf};
    EXPECT_EQ(conf->m_ready_calls, 0);

    worker.start();
    ASSERT_TRUE(tryVerify([&] { return conf->m_ready_calls == 1; }));

    EXPECT_EQ(conf->m_tick_calls, 0);
    worker.proceed();
    ASSERT_TRUE(tryVerify([&] { return conf->m_tick_calls == 1; }));

    EXPECT_EQ(conf->m_complete_calls, 0);
    worker.stop();
    ASSERT_TRUE(tryVerify([&] { return conf->m_complete_calls == 1; }));
}
