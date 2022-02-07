declare module "asan-test-module"
{
    const asanModule: EmscriptenModuleFactory<ITestModule>;
    export default asanModule;
}

declare module "safe-heap-test-module"
{
    const safeHeapModule: EmscriptenModuleFactory<ITestModule>;
    export default safeHeapModule;
}