import { fpIdentity } from "../../fp/impl/fp-identity";
import { mapValuesToArray } from "../../map/impl/map-values-to-array";

export function arrayUnion<TItem>
(
    items: readonly ArrayLike<TItem>[],
    getComparisonValue: (item: TItem) => unknown = fpIdentity,
)
    : TItem[]
{
    const result = new Map<unknown, TItem>();

    for (let i = 0, iEnd = items.length; i < iEnd; ++i)
    {
        const innerItems = items[i];

        for (let j = 0, jEnd = innerItems.length; j < jEnd; ++j)
        {
            const item = innerItems[j];
            result.set(getComparisonValue(item), item);
        }
    }

    return mapValuesToArray(result);
}