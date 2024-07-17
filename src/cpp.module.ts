import type { IJsUtilBindings } from "./web-assembly/i-js-util-bindings.js";

export const exportedFunctions: { [index in keyof IJsUtilBindings]: boolean; } = {
    _jsUtilEndProgram: true,
    _jsUtilCalloc: true,
    _jsUtilMalloc: true,
    _jsUtilFree: true,
    runtimeKeepalivePush: true,
    runtimeKeepalivePop: true,
    _jsUtilDeleteObject: false,
    _isDebugBuild: true,
    _f32SharedArray_createOne: true,
    _f32SharedArray_destroy: true,
    _f32SharedArray_getArrayAddress: true,
    _f64SharedArray_createOne: true,
    _f64SharedArray_destroy: true,
    _f64SharedArray_getArrayAddress: true,
    _workerPool_createRoundRobin: true,
    _workerPool_start: true,
    _workerPool_setBatchEndPoint: true,
    _workerPool_isBatchDone: true,
    _workerPool_invalidateBatch: true,
    _workerPool_areWorkersSynced: true,
    _workerPool_stop: true,
    _workerPool_createJob: true,
    _workerPool_deleteJob: true,
    _workerPool_addJob: true,
    _workerPool_isAnyWorkerRunning: true,
    _workerPool_isAcceptingJobs: true,
    _workerPool_hasPendingWork: true,
    _malloc: true,
    _free: true,
};

export const exportedTestFunctions = {
    ...exportedFunctions,
};