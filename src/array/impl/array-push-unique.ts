import { fpIdentity } from "../../fp/impl/fp-identity.js";

/**
 * @public
 * Like `Array.push` but checks if the value is unique first.
 *
 * @returns true if an element was pushed.
 *
 * @remarks
 * See {@link arrayPushUnique}.
 */
export function arrayPushUnique<TItem>
(
    items: TItem[],
    itemToPush: TItem,
    getComparisonValue: (item: TItem) => unknown = fpIdentity,
)
    : boolean
{
    const comparisonValue = getComparisonValue(itemToPush);

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        if (getComparisonValue(items[i]) === comparisonValue)
        {
            return false;
        }
    }

    items.push(itemToPush);

    return true;
}