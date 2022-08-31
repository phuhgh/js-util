import type { IJsUtilBindings } from "./web-assembly/i-js-util-bindings";

export const exportedFunctions: { [index in keyof IJsUtilBindings]: boolean; } = {
    _jsUtilEndProgram: true,
    _jsUtilCalloc: true,
    _jsUtilMalloc: true,
    _jsUtilFree: true,
    _f32SharedArray_createOne: true,
    _f32SharedArray_delete: true,
    _f32SharedArray_getArrayAddress: true,
    _f64SharedArray_createOne: true,
    _f64SharedArray_delete: true,
    _f64SharedArray_getArrayAddress: true
};