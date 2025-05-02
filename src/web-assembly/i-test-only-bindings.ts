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

    testVector_readWriteU16Vec2(ptrF32Vec2: number): number;
    testSegmentedDataView_readWriteU16(data: number, descriptor: number): number;
    testResizableArray_readWriteU16(data: number): number;
}