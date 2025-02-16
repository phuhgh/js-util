#include "FakeWorkerConfig.h"
#include "JsUtil/SmartLocked.hpp"
#include "JsUtil/WorkerPool.hpp"
#include "JsUtilTestUtil/ThreadingHelpers.hpp"
#include <gtest/gtest.h>
#include <memory>

using namespace JsUtil;

TEST(WorkerPoolJob, cleanup)
{
    Debug::disableJsIntegration();

    std::atomic<int> jobsExecuted{0};
    WorkerLoop       workerLoop{PoolWorkerConfig{}};
    ASSERT_TRUE(workerLoop.start());
    workerLoop.getTask().addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
        ++jobsExecuted;
    }));
    EXPECT_EQ(jobsExecuted.load(), 0);
    EXPECT_TRUE(workerLoop.getTask().hasPendingWork());
    // this test relies on the address sanitizer to pick up on the job not getting deleted
}

TEST(WorkerPoolJob, workerJobHandling)
{
    std::atomic<int> jobsExecuted{0};
    WorkerLoop       workerLoop{PoolWorkerConfig{}};
    ASSERT_TRUE(workerLoop.start());
    workerLoop.getTask().addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
        ++jobsExecuted;
    }));
    workerLoop.getTask().addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
        ++jobsExecuted;
    }));
    workerLoop.getTask().addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
        ++jobsExecuted;
    }));
    // notification is handled in the distribution strategy, give it a manual poke just for testing purposes
    workerLoop.proceed();
    EXPECT_TRUE(tryVerify([&]() { return !workerLoop.getTask().hasPendingWork(); }));
    EXPECT_EQ(jobsExecuted.load(), 3);
}

TEST(WorkerPoolJob, overflowHandling)
{
    std::atomic<int> jobsExecuted{0};
    WorkerLoop       workerLoop{PoolWorkerConfig{1}};
    auto             overflowJob = std::shared_ptr<IExecutor>{new CallbackExecutor([&]() noexcept { ++jobsExecuted; })};
    workerLoop.getTask().addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
        ++jobsExecuted;
    }));
    ASSERT_FALSE(workerLoop.getTask().addJob(overflowJob));
    ASSERT_FALSE(workerLoop.getTask().addJob(overflowJob));
    ASSERT_TRUE(workerLoop.start(true));
    ASSERT_TRUE(tryVerify([&]() { return !workerLoop.getTask().hasPendingWork(); }));
    overflowJob.reset();
    EXPECT_EQ(jobsExecuted.load(), 1);
}

TEST(WorkerPool, distribution)
{
    std::atomic<int>                       jobsExecuted{0};
    SmartLocked<std::set<std::thread::id>> threadIds{{}};
    WorkerPool                             workerPool{RoundRobin{}, WorkerPoolConfig{}};
    workerPool.start();

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
    Debug::disableJsIntegration();

    std::atomic<int>                       jobsExecuted{0};
    SmartLocked<std::set<std::thread::id>> threadIds{{}};
    WorkerPool                             workerPool{RoundRobin{}, WorkerPoolConfig{2, 1}};
    workerPool.start();

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
    /**
     *todo jack: I've seen for this test, only once, possibly missing a null check somewhere?
    node:internal/event_target:1062
  process.nextTick(() => { throw err; });
                           ^
Error [RuntimeError]: null function or function signature mismatch
    at wasm://wasm/0017fb0e:wasm-function[525]:0x21505
    at wasm://wasm/0017fb0e:wasm-function[687]:0x2d60e
    at invokeEntryPoint (/home/jack/dev/rc/js-util/cpp/build/release/test/TestWorkerPool.js:1:17029)
    at handleMessage (/home/jack/dev/rc/js-util/cpp/build/release/test/TestWorkerPool.js:1:5988)
    at MessagePort.<anonymous> (/home/jack/dev/rc/js-util/cpp/build/release/test/TestWorkerPool.js:1:4353)
    at [nodejs.internal.kHybridDispatch] (node:internal/event_target:786:20)
    at exports.emitMessage (node:internal/per_context/messageport:23:28)
    */
    SmartLocked<std::map<std::thread::id, std::atomic<unsigned>>> threadIds{{}};
    WorkerPool                                                    workerPool{PassToAll{}, WorkerPoolConfig{}};
    workerPool.start();

    for (int i = 0; i < 16; ++i)
    {
        workerPool.addJob(std::make_shared<CallbackExecutor<std::function<void()>>>([&]() noexcept -> void {
            threadIds.getMutableRef().operator*()[std::this_thread::get_id()]++;
        }));
    }
    ASSERT_TRUE(tryVerify([&]() { return !workerPool.hasPendingWork(); }));
    EXPECT_EQ(threadIds.getReadonlyRef()->size(), 4);

    for (auto const& [_, callCount] : *threadIds.getReadonlyRef())
    {
        EXPECT_EQ(callCount, 16);
    }
}

// todo jack: allocation failure of worker threads?
