export const arrayIsArray = (obj: unknown) =>
{
    return obj instanceof Array || ArrayBuffer.isView(obj);
};