import { arrayIndex } from "./array-index";
import { fpIdentity } from "../../fp/impl/fp-identity";

export function arrayIntersect<TItem>
(
    a: ArrayLike<TItem>,
    b: ArrayLike<TItem>,
    getComparisonValue: (item: TItem, index: number) => unknown = fpIdentity,
)
    : TItem[]
{
    const result: TItem[] = [];
    const bIndex = arrayIndex(b, getComparisonValue);

    for (let i = 0, iEnd = a.length; i < iEnd; ++i)
    {
        const item = a[i];

        if (bIndex.has(getComparisonValue(item, i)))
        {
            result.push(item);
        }
    }

    return result;
}