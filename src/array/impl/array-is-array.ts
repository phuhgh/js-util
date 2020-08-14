export const arrayIsArray = (obj: unknown): obj is ArrayLike<unknown> =>
{
    return obj instanceof Array || ArrayBuffer.isView(obj);
};