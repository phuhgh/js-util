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
    setTestCategoryFlag(): void;

    testVector_readWriteF32Vec2(ptrF32Vec2: number): number;
}