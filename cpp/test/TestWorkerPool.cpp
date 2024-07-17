#include "FakeWorkerConfig.h"
#include "JsUtil/SmartLocked.h"
#include "JsUtil/WorkerPool.h"
#include "JsUtilTestUtil/ThreadingHelpers.h"
#include <gtest/gtest.h>

using namespace JsUtil;

TEST(WorkerPoolJob, cleanup)
{
    Debug::disableJsIntegration();

    std::atomic<int> jobsExecuted{0};
    WorkerLoop       workerLoop{PoolWorkerConfig{}};
    ASSERT_TRUE(workerLoop.start());
    workerLoop.getTask().addJob(new CallbackExecutor([&]() { ++jobsExecuted; }));
    EXPECT_EQ(jobsExecuted.load(), 0);
    EXPECT_TRUE(workerLoop.getTask().hasPendingWork());
    // this test relies on the address sanitizer to pick up on the job not getting deleted
}

TEST(WorkerPoolJob, workerJobHandling)
{
    std::atomic<int> jobsExecuted{0};
    WorkerLoop       workerLoop{PoolWorkerConfig{}};
    ASSERT_TRUE(workerLoop.start());
    workerLoop.getTask().addJob(new CallbackExecutor([&]() { ++jobsExecuted; }));
    workerLoop.getTask().addJob(new CallbackExecutor([&]() { ++jobsExecuted; }));
    workerLoop.getTask().addJob(new CallbackExecutor([&]() { ++jobsExecuted; }));
    // notification is handled in the distribution strategy, give it a manual poke just for testing purposes
    workerLoop.proceed();
    EXPECT_TRUE(tryVerify([&]() { return !workerLoop.getTask().hasPendingWork(); }));
    EXPECT_EQ(jobsExecuted.load(), 3);
}

TEST(WorkerPoolJob, overflowHandling)
{
    std::atomic<int>                jobsExecuted{0};
    WorkerLoop                      workerLoop{PoolWorkerConfig{1}};
    gsl::owner<IExecutor*> overflowJob = new CallbackExecutor([&]() { ++jobsExecuted; });
    ASSERT_TRUE(workerLoop.getTask().addJob(new CallbackExecutor([&]() { ++jobsExecuted; })));
    ASSERT_FALSE(workerLoop.getTask().addJob(overflowJob));
    ASSERT_FALSE(workerLoop.getTask().addJob(overflowJob));
    ASSERT_TRUE(workerLoop.start(true));
    ASSERT_TRUE(tryVerify([&]() { return !workerLoop.getTask().hasPendingWork(); }));
    delete overflowJob;
    EXPECT_EQ(jobsExecuted.load(), 1); // todo jack: this was 0
}

TEST(WorkerPool, distribution)
{
    std::atomic<int>                       jobsExecuted{0};
    SmartLocked<std::set<std::thread::id>> threadIds{{}};
    WorkerPool                             workerPool{RoundRobin{}, WorkerPoolConfig{}};
    workerPool.start();

    for (int i = 0; i < 16; ++i)
    {
        workerPool.addJob(new CallbackExecutor([&]() {
            ++jobsExecuted;
            threadIds.getMutableRef()->emplace(std::this_thread::get_id());
        }));
    }
    ASSERT_TRUE(tryVerify([&]() { return !workerPool.hasPendingWork(); }));
    EXPECT_EQ(jobsExecuted.load(), 16);
    EXPECT_EQ(threadIds.getReadonlyRef()->size(), 4);
}

TEST(WorkerPool, overflowHandling)
{
    Debug::disableJsIntegration();

    std::atomic<int>                       jobsExecuted{0};
    SmartLocked<std::set<std::thread::id>> threadIds{{}};
    WorkerPool                             workerPool{RoundRobin{}, WorkerPoolConfig{2, 1}};
    workerPool.start();

    for (int i = 0; i < 16; ++i)
    {
        workerPool.addJob(new CallbackExecutor([&]() {
            ++jobsExecuted;
            threadIds.getMutableRef()->emplace(std::this_thread::get_id());
            std::this_thread::sleep_for(std::chrono::milliseconds(20));
        }));
    }
    ASSERT_TRUE(tryVerify([&]() { return !workerPool.hasPendingWork(); }));
    EXPECT_EQ(jobsExecuted.load(), 16);               // all jobs should still run
    EXPECT_EQ(threadIds.getReadonlyRef()->size(), 3); // we have 2 workers, but it should end up on the UI thread too
}

TEST(WorkerPool, invalidation)
{
    Debug::disableJsIntegration();

    std::atomic<bool> block_worker = true;
    std::atomic<int>  jobsExecuted{0};
    WorkerPool        workerPool{RoundRobin{}, WorkerPoolConfig{1, 32}};
    workerPool.start();

    for (int i = 0; i < 16; ++i)
    {
        if (i == 8)
        {
            ASSERT_TRUE(tryVerify([&]() { return jobsExecuted.load() == 1; }));
            // bin off jobs 1 through 7 (0 is already running)
            workerPool.setBatchEndPoint();
            workerPool.invalidateBatch();
            // unblock, only 8 through 15 should run
            block_worker = false;
        }

        workerPool.addJob(new CallbackExecutor([&]() {
            ++jobsExecuted;
            while (block_worker)
            {
                // simple busy wait...
            }
        }));
    }
    ASSERT_TRUE(tryVerify([&]() { return !workerPool.hasPendingWork(); }));
    // first job, plus the last 8
    EXPECT_EQ(jobsExecuted.load(), 9);
}
// todo jack: allocation failure of worker threads?