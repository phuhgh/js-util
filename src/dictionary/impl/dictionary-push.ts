import { IDictionary } from "../../typescript/i-dictionary.js";

/**
 * @public
 * Used with dictionary that store arrays. Where an array exists for a given key the value will be appended to that array, otherwise a new array will be created containing the value.
 * @param dict - The object to check. May be modified.
 * @param key - The key to lookup in `dict`.
 * @param value - The value to push.
 * @remarks
 * See {@link dictionaryPush}.
 */
export function dictionaryPush<TItem>
(
    dict: IDictionary<TItem[]>,
    key: keyof typeof dict,
    value: TItem
)
    : void
{
    const values = dict[key];

    if (values != null)
    {
        values.push(value);
    }
    else
    {
        dict[key] = [value];
    }
}