import { fpIdentity } from "../../fp/impl/fp-identity";

/**
 * @public
 * Like `Array.push` but checks if the value is unique first.
 * @remarks
 * See {@link arrayPushUnique}.
 */
export function arrayPushUnique<TItem>
(
    items: TItem[],
    itemToPush: TItem,
    getComparisonValue: (item: TItem) => unknown = fpIdentity,
)
    : void
{
    const comparisonValue = getComparisonValue(itemToPush);

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        if (getComparisonValue(items[i]) === comparisonValue)
        {
            return;
        }
    }

    items.push(itemToPush);
}