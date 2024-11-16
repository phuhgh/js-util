/**
 * @internal
 */
export interface ITestOnlyBindings
{
    fakeWorkerJob_resetCounts(): void;
    fakeWorkerJob_getCreateCount(): number;
    fakeWorkerJob_getTickCount(): number;
    fakeWorkerJob_getDestroyCount(): number;
    fakeWorkerJob_createJob(goSlow: boolean): number;
}