import { dictionaryOverwrite } from "./dictionary-overwrite.js";

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
    dictionaryOverwrite(extended, base);
    dictionaryOverwrite(extended, extension);

    return extended;
}