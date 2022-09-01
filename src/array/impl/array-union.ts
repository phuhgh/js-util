import { fpIdentity } from "../../fp/impl/fp-identity.js";
import { mapValuesToArray } from "../../map/impl/map-values-to-array.js";

/**
 * @public
 * Given an `ArrayLike` of `ArrayLike`, provides all unique items in an `Array`.
 *
 * @remarks
 * See {@link arrayUnion}.
 */
export function arrayUnion<TItem>
(
    items: ArrayLike<ArrayLike<TItem>>,
    getComparisonValue: (item: TItem, index: number) => unknown = fpIdentity,
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
            result.set(getComparisonValue(item, j), item);
        }
    }

    return mapValuesToArray(result);
}