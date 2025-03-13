#include "FakeWorkerConfig.h"
#include "JsUtil/SmartLocked.hpp"
#include "JsUtil/WorkerPool.hpp"
#include "JsUtilTestUtil/DisableJsIntegration.hpp"
#include "JsUtilTestUtil/ThreadingHelpers.hpp"
#include <gtest/gtest.h>
#include <memory>

using namespace JsUtil;

[[maybe_unused]] static DisableJsIntegration const scDISABLE_JS_INTEGRATION;

TEST(WorkerPoolJob, cleanup)
{
    std::atomic<int> jobsExecuted{0};
    WorkerLoop       workerLoop{WorkerPoolTaskConfig{}};
    ASSERT_TRUE(workerLoop.start());
    workerLoop.getTaskConfig().addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
        ++jobsExecuted;
    }));
    EXPECT_EQ(jobsExecuted.load(), 0);
    EXPECT_TRUE(workerLoop.getTaskConfig().hasPendingWork());
    // this test relies on the address sanitizer to pick up on the job not getting deleted
}

TEST(WorkerPoolJob, workerJobHandling)
{
    std::atomic<int> jobsExecuted{0};
    WorkerLoop       workerLoop{WorkerPoolTaskConfig{}};
    ASSERT_TRUE(workerLoop.start());
    workerLoop.getTaskConfig().addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
        ++jobsExecuted;
    }));
    workerLoop.getTaskConfig().addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
        ++jobsExecuted;
    }));
    workerLoop.getTaskConfig().addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
        ++jobsExecuted;
    }));
    // notification is handled in the distribution strategy, give it a manual poke just for testing purposes
    workerLoop.proceed();
    EXPECT_TRUE(tryVerify([&]() { return !workerLoop.getTaskConfig().hasPendingWork(); }));
    EXPECT_EQ(jobsExecuted.load(), 3);
}

TEST(WorkerPoolJob, overflowHandling)
{
    std::atomic<int> jobsExecuted{0};
    WorkerLoop       workerLoop{WorkerPoolTaskConfig{1}};
    auto             overflowJob = std::shared_ptr<IExecutor>{new CallbackExecutor([&]() noexcept { ++jobsExecuted; })};
    workerLoop.getTaskConfig().addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
        ++jobsExecuted;
    }));
    ASSERT_FALSE(workerLoop.getTaskConfig().addJob(overflowJob));
    ASSERT_FALSE(workerLoop.getTaskConfig().addJob(overflowJob));
    ASSERT_TRUE(workerLoop.start(true));
    ASSERT_TRUE(tryVerify([&]() { return !workerLoop.getTaskConfig().hasPendingWork(); }));
    overflowJob.reset();
    EXPECT_EQ(jobsExecuted.load(), 1);
}

TEST(WorkerPool, distribution)
{
    std::atomic<int>                       jobsExecuted{0};
    SmartLocked<std::set<std::thread::id>> threadIds{{}};
    WorkerPool                             workerPool{RoundRobin{}, WorkerPoolConfig{}};
    ASSERT_EQ(workerPool.start(), 4);

    for (int i = 0; i < 16; ++i)
    {
        workerPool.addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
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
    std::atomic<int>                       jobsExecuted{0};
    SmartLocked<std::set<std::thread::id>> threadIds{{}};
    WorkerPool                             workerPool{RoundRobin{}, WorkerPoolConfig{2, 1}};
    ASSERT_EQ(workerPool.start(), 2);

    for (int i = 0; i < 16; ++i)
    {
        workerPool.addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
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
    std::atomic<bool> block_worker = true;
    std::atomic<int>  jobsExecuted{0};
    WorkerPool        workerPool{RoundRobin{}, WorkerPoolConfig{1, 32}};
    ASSERT_EQ(workerPool.start(), 1);

    for (int i = 0; i < 16; ++i)
    {
        if (i == 8)
        {
            ASSERT_TRUE(tryVerify([&]() { return jobsExecuted.load() == 1; }));
            // bin off jobs 1 through 7 (0 is already running)
            workerPool.setBatchEndPoint();
            workerPool.invalidateBatch();
            EXPECT_FALSE(workerPool.areAllWorkersSynced());
            // unblock, only 8 through 15 should run
            block_worker = false;
            EXPECT_TRUE(tryVerify([&] { return workerPool.areAllWorkersSynced(); }));
        }

        workerPool.addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
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

TEST(WorkerPool, distributeToAll)
{
    SmartLocked<std::map<std::thread::id, std::atomic<unsigned>>> threadIds{{}};
    WorkerPool workerPool{PassToAll{}, WorkerPoolConfig{.syncOverflowHandling = false}};
    ASSERT_EQ(workerPool.start(), 4);

    for (int i = 0; i < 16; ++i)
    {
        auto jobAdded =
            workerPool.addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
                threadIds.getMutableRef().operator*()[std::this_thread::get_id()]++;
            }));
        EXPECT_TRUE(jobAdded);
    }
    ASSERT_TRUE(tryVerify([&]() { return !workerPool.hasPendingWork(); }));
    EXPECT_EQ(threadIds.getReadonlyRef()->size(), 4);

    for (auto const& [_, callCount] : *threadIds.getReadonlyRef())
    {
        EXPECT_EQ(callCount, 16);
    }
}
