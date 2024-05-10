import type { IJsUtilBindings, IJsUtilTestBindings } from "./web-assembly/i-js-util-bindings.js";

export const exportedFunctions: { [index in keyof IJsUtilBindings]: boolean; } = {
    _jsUtilEndProgram: true,
    _jsUtilCalloc: true,
    _jsUtilMalloc: true,
    _jsUtilFree: true,
    _isDebugBuild: true,
    _f32SharedArray_createOne: true,
    _f32SharedArray_destroy: true,
    _f32SharedArray_getArrayAddress: true,
    _f64SharedArray_createOne: true,
    _f64SharedArray_destroy: true,
    _f64SharedArray_getArrayAddress: true,
    _malloc: true,
    _free: true,
};

export const exportedTestFunctions: { [index in keyof IJsUtilTestBindings]: boolean; } = {
    ...exportedFunctions,
    // todo jack: make it not stoopid
    // _jsUtilTestFoo: true,
};