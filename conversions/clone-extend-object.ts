import { extendObject } from "./extend-object";
import { IDictionary } from "../models/i-dictionary";

export function cloneExtendObject<T extends object, U extends object>(obj: T, extension: U): T & U
{
    const extended: IDictionary<any> = {};
    extendObject(extended, obj);
    extendObject(extended, extension);
    return extended as T & U;
}