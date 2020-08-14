import { IDictionary } from "../../i-dictionary";
import { dictionaryExtend } from "./dictionary-extend";

/**
 * Create an object which is extended by base and then extension
 */
export function dictionaryCloneExtend<T extends object, U extends object>(base: T, extension: U): T & U
{
    const extended: IDictionary<any> = {};
    dictionaryExtend(extended, base);
    dictionaryExtend(extended, extension);

    return extended as T & U;
}