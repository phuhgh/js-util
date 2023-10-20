import { _Debug } from "../../debug/_debug.js";
import { arrayIsArray } from "../../array/impl/array-is-array.js";

/**
 * @public
 * Modifies an object to include the keys and values of another.
 * @param base - The object to be modified, must be a superset of extension.
 * @param extension - The object to be applied to `base`.
 *
 * @remarks
 * See {@link dictionaryOverwrite}.
 */
export function dictionaryOverwrite<TBase extends TExtension, TExtension extends object>
(
    base: TBase,
    extension: TExtension,
)
    : void
{
    _BUILD.DEBUG && _Debug.runBlock(() =>
    {
        _Debug.assert(!arrayIsArray(base) && !arrayIsArray(extension), "should not be used with arrays");
    });

    const keys = Object.keys(extension) as (keyof TExtension)[];

    for (let i = 0, l = keys.length; i < l; ++i)
    {
        const key = keys[i];
        base[key] = extension[key] as TBase[keyof TExtension];
    }
}