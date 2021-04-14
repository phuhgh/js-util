export const arrayIsArray = (obj: unknown): boolean =>
{
    return obj instanceof Array || ArrayBuffer.isView(obj);
};