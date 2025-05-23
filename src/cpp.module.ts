import type { IJsUtilBindings } from "./web-assembly/i-js-util-bindings.js";

export const exportedFunctions: { [index in keyof IJsUtilBindings]: boolean; } = {
    _jsuInitializeSelf: true,
    _jsUtilEndProgram: true,
    _jsUtilCalloc: true,
    _jsUtilMalloc: true,
    _jsUtilFree: true,
    _jsUtilAddRuntimeMappings: true,
    _jsUtilHasRuntimeMappingId: true,
    _jsUtilGetRuntimeMappingAddress: true,
    _jsUtilRemoveRuntimeMappings: true,
    _jsUtilGetRuntimeMappingId: true,
    _jsUtilCreateVec: true,
    runtimeKeepalivePush: true,
    runtimeKeepalivePop: true,
    _jsUtilDeleteObject: true,
    _isDebugBuild: true,
    _sharedArray_createOne: true,
    _sharedArray_getDataAddress: true,
    _resizableArray_createOne: true,
    _resizableArray_getDataAddress: true,
    _resizableArray_setSize: true,
    _workerPool_createRoundRobin: true,
    _workerPool_start: true,
    _workerPool_setBatchEndPoint: true,
    _workerPool_isBatchDone: true,
    _workerPool_invalidateBatch: true,
    _workerPool_areWorkersSynced: true,
    _workerPool_stop: true,
    _workerPool_addJob: true,
    _workerPool_isAnyWorkerRunning: true,
    _workerPool_isAcceptingJobs: true,
    _workerPool_hasPendingWork: true,
    _malloc: true,
    _free: true,
};