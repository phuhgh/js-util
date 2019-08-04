import { IDictionary } from "../../i-dictionary";
import { dictionaryExtend } from "./dictionary-extend";

export function dictionaryCloneExtend<T extends object, U extends object>(obj: T, extension: U): T & U
{
    const extended: IDictionary<any> = {};
    dictionaryExtend(extended, obj);
    dictionaryExtend(extended, extension);

    return extended as T & U;
}