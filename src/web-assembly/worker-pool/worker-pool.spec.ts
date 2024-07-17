import utilTestModule from "../../external/util-test-module.mjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";
import { type IErrorExclusions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { asyncBlockScopedCallback } from "../../lifecycle/block-scoped-lifecycle.js";
import { IJsUtilBindings } from "../i-js-util-bindings.js";
import { EWorkerPoolOverflowMode, WorkerPool } from "./worker-pool.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import { promisePoll } from "../../promise/impl/promise-poll.js";

interface ITestOnlyBindings
{
    fakeWorkerJob_resetCounts(): void;
    fakeWorkerJob_getCreateCount(): number;
    fakeWorkerJob_getTickCount(): number;
    fakeWorkerJob_getDestroyCount(): number;
    fakeWorkerJob_setJobFactory(goSlow: boolean): void;
}

describe("=> WorkerPool", () =>
{
    const testModule = new SanitizedEmscriptenTestModule<IJsUtilBindings, ITestOnlyBindings>(
        utilTestModule,
        getTestModuleOptions(),
    );

    beforeEach(async () =>
    {
        Test_setDefaultFlags();
        await testModule.initialize();
    });

    afterEach(() =>
    {
        testModule.endEmscriptenProgram();
    });

    it("| executes jobs on the workers", asyncBlockScopedCallback(async () =>
    {
        // manually verified using dev tools that this is loading the web workers evenly
        const pool = WorkerPool.createRoundRobin(testModule.wrapper, { workerCount: 4, queueSize: 2000 }, null);
        expect(pool.sharedObject.getPtr()).not.toBe(nullPtr);
        testModule.wrapper.instance.fakeWorkerJob_setJobFactory(false);
        expect(testModule.wrapper.instance.fakeWorkerJob_getTickCount()).toBe(0);
        expect(await pool.start()).toBe(4);
        expect(pool.isRunning()).toBe(true);

        for (let i = 0; i < 1e4; ++i)
        {
            addTestJob(testModule, pool);
        }

        pool.setBatchEnd();

        await promisePoll(() => pool.isBatchDone()).getPromise();
        expect(testModule.wrapper.instance.fakeWorkerJob_getTickCount()).toBe(1e4);

        await pool.stop();

        // ignore "error" emitted by emscripten around joining on the main thread
        testModule.runWithDisabledErrors(disabledErrors, () => pool.sharedObject.release());
    }));

    it("| allows for cancellation of jobs", asyncBlockScopedCallback(async () =>
    {
        const pool = WorkerPool.createRoundRobin(
            testModule.wrapper,
            { workerCount: 1, queueSize: 0xFFFF, overflowMode: EWorkerPoolOverflowMode.Throw },
            null
        );
        expect(pool.sharedObject.getPtr()).not.toBe(nullPtr);
        testModule.wrapper.instance.fakeWorkerJob_setJobFactory(true);
        expect(testModule.wrapper.instance.fakeWorkerJob_getTickCount()).toBe(0);
        expect(await pool.start()).toBe(1);

        for (let i = 0; i < 1e4; ++i)
        {
            addTestJob(testModule, pool);
        }
        pool.setBatchEnd();
        pool.invalidateBatch();
        await promisePoll(() => pool.areWorkersSynced()).getPromise();
        await promisePoll(() => pool.isBatchDone()).getPromise();

        // allow about 5 seconds (absurdly long) for the jobs to be added (each job takes > 20 ms to run, ~20 s total)
        expect(testModule.wrapper.instance.fakeWorkerJob_getTickCount()).toBeLessThan(2.5e3);

        await pool.stop();

        // ignore "error" emitted by emscripten around joining on the main thread
        testModule.runWithDisabledErrors(disabledErrors, () => pool.sharedObject.release());
    }));
});

function addTestJob(testModule: SanitizedEmscriptenTestModule<IJsUtilBindings, ITestOnlyBindings>, pool: WorkerPool)
{
    const jobPtr = testModule.wrapper.instance._workerPool_createJob();
    expect(jobPtr).not.toEqual(nullPtr);

    if (jobPtr !== nullPtr)
    {
        pool.addJob(jobPtr);
    }
}

const disabledErrors: IErrorExclusions = {
    // while true, undefined behavior is even worse... allow shutdown to be the special case exception
    startsWith: ["Blocking on the main thread is very dangerous"]
};