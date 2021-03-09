/**
 * @public
 * Typed array type guards, do not test for these at run time.
 */
export enum EArrayTypeGuard
{
    F32 = "FLOAT32",
    F64 = "FLOAT64",
    I32 = "INT32",
    U32 = "UINT32",
    I16 = "INT16",
    U16 = "UINT16",
    I8 = "INT8",
    U8 = "UINT8",
    C8 = "CLAMPED_INT8"
}