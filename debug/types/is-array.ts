export const isArray = (obj: unknown) =>
{
    return obj instanceof Array || ArrayBuffer.isView(obj);
};