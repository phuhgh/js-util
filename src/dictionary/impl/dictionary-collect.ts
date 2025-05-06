import type { TProperty } from "../../typescript/t-property.js";

/**
 * @public
 * Like `Array.reduce` but for dictionaries and without the requirement to return the value in the callback.
 *
 * @remarks
 * See {@link dictionaryCollect}.
 */
export function dictionaryCollect<TRet, TKey extends string | number | symbol, TItem>
(
    items: TProperty<TKey, TItem>,
    collected: TRet,
    collect: (collected: TRet, item: TItem, key: TKey, index: number) => void,
    keys: readonly TKey[] = Object.keys(items) as TKey[],
)
    : TRet
{
    for (let i = 0, iEnd = keys.length; i < iEnd; ++i)
    {
        const key = keys[i];
        collect(collected, items[key], key, i);
    }

    return collected;
}