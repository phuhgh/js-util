/**
 * @public
 * Checks if the parameter is an instance of `Array` or is a view of `ArrayBuffer`.
 *
 * @remarks
 * See {@link arrayIsArray}.
 */
export function arrayIsArray(obj: unknown): boolean
{
    return obj instanceof Array || ArrayBuffer.isView(obj);
}