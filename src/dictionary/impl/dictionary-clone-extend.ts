import { dictionaryExtend } from "./dictionary-extend.js";

/**
 * @public
 * Creates an object which is extended sequentially by two additional objects.
 * @param base - The object to apply first.
 * @param extension - The object to apply second.
 *
 * @remarks
 * See {@link dictionaryCloneExtend}.
 */
export function dictionaryCloneExtend<T extends object, U extends object>
(
    base: T,
    extension: U
)
    : T & U
{
    const extended = {} as T & U;
    dictionaryExtend(extended, base);
    dictionaryExtend(extended, extension);

    return extended;
}