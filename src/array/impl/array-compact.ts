import { TNullable } from "../../typescript/t-nullable";

/**
 * @return a new array with null & undefined removed from items
 */
export function arrayCompact<TItem>(items: ArrayLike<TNullable<TItem>>): TItem[]
{
    const result: TItem[] = [];

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        const item = items[i];

        if (item != null)
        {
            result.push(item);
        }
    }

    return result;
}