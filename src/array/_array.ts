import { arrayBinaryIndexOf } from "./impl/array-binary-index-of.js";
import { arrayIsArray } from "./impl/array-is-array.js";
import { arrayBinaryLastIndexOf } from "./impl/array-binary-last-index-of.js";
import { arrayMap } from "./impl/array-map.js";
import { arrayCopyInto } from "./impl/array-copy-into.js";
import { arrayFlatMap } from "./impl/array-flat-map.js";
import { arrayForEach } from "./impl/array-for-each.js";
import { arrayIndex } from "./impl/array-index.js";
import { arrayIntersect } from "./impl/array-intersect.js";
import { arrayLast } from "./impl/array-last.js";
import { arrayNormalizeEmptyToUndefined } from "./impl/array-normalize-empty-to-undefined.js";
import { arrayNormalizeNullishToEmpty } from "./impl/array-normalize-nullish-to-empty.js";
import { arrayCollect } from "./impl/array-collect.js";
import { arrayRemoveMany } from "./impl/array-remove-many.js";
import { arrayRemoveOne } from "./impl/array-remove-one.js";
import { arrayReplaceOne } from "./impl/array-replace-one.js";
import { arrayCompact } from "./impl/array-compact.js";
import { arrayCompactMap } from "./impl/array-compact-map.js";
import { arrayUnion } from "./impl/array-union.js";
import { arrayPushUnique } from "./impl/array-push-unique.js";
import { arrayEmptyArray } from "./impl/array-empty-array.js";
import { arrayGenerateRange } from "./impl/array-generate-range.js";
import { arrayMapRange } from "./impl/array-map-range.js";
import { arrayContains } from "./impl/array-contains.js";
import { arrayInsertAtIndex } from "./impl/array-insert-at-index.js";
import { arraySymmetricDifference } from "./impl/array-symmetric-difference.js";
import { arraySetDifference } from "./impl/array-set-difference.js";
import { arrayIsNotEmpty } from "./impl/array-is-not-empty.js";
import { arrayUnique } from "./impl/array-unique.js";
import { arrayAddToSet } from "./impl/array-add-to-set.js";
import { arrayForEachRange } from "./impl/array-for-each-range.js";
import { arrayMax } from "./impl/array-max.js";
import { arrayMin } from "./impl/array-min.js";

/**
 * @public
 * Utilities that apply to `Array` and `ArrayLike`.
 */
export class _Array
{
    /** {@inheritDoc arrayAddToSet} */
    public static readonly addToSet = arrayAddToSet;
    /** {@inheritDoc arrayBinaryIndexOf} */
    public static readonly binaryIndexOf = arrayBinaryIndexOf;
    /** {@inheritDoc arrayBinaryLastIndexOf} */
    public static readonly binaryLastIndexOf = arrayBinaryLastIndexOf;
    /** {@inheritDoc arrayCollect} */
    public static readonly collect = arrayCollect;
    /** {@inheritDoc arrayCompact} */
    public static readonly compact = arrayCompact;
    /** {@inheritDoc arrayCompactMap} */
    public static readonly compactMap = arrayCompactMap;
    /** {@inheritDoc (arrayContains:2)} */
    public static readonly contains = arrayContains;
    /** {@inheritDoc arrayCopyInto} */
    public static readonly copyInto = arrayCopyInto;
    /** {@inheritDoc arrayEmptyArray} */
    public static readonly emptyArray = arrayEmptyArray;
    /** {@inheritDoc arrayFlatMap} */
    public static readonly flatMap = arrayFlatMap;
    /** {@inheritDoc arrayForEach} */
    public static readonly forEach = arrayForEach;
    /** {@inheritDoc arrayForEachRange} */
    public static readonly forEachRange = arrayForEachRange;
    /** {@inheritDoc arrayGenerateRange} */
    public static readonly generateRange = arrayGenerateRange;
    /** {@inheritDoc arrayIndex} */
    public static readonly index = arrayIndex;
    /** {@inheritDoc arrayInsertAtIndex} */
    public static readonly insertAtIndex = arrayInsertAtIndex;
    /** {@inheritDoc arrayIntersect} */
    public static readonly intersect = arrayIntersect;
    /** {@inheritDoc arrayIsArray} */
    public static readonly isArray = arrayIsArray;
    /** {@inheritDoc arrayIsNotEmpty} */
    public static readonly isNotEmpty = arrayIsNotEmpty;
    /** {@inheritDoc arrayLast} */
    public static readonly last = arrayLast;
    /** {@inheritDoc arrayMap} */
    public static readonly map = arrayMap;
    /** {@inheritDoc arrayMapRange} */
    public static readonly mapRange = arrayMapRange;
    /** {@inheritDoc arrayMax} */
    public static readonly max = arrayMax;
    /** {@inheritDoc arrayMin} */
    public static readonly min = arrayMin;
    /** {@inheritDoc arrayNormalizeEmptyToUndefined} */
    public static readonly normalizeEmptyToUndefined = arrayNormalizeEmptyToUndefined;
    /** {@inheritDoc arrayNormalizeNullishToEmpty} */
    public static readonly normalizeNullishToEmpty = arrayNormalizeNullishToEmpty;
    /** {@inheritDoc arrayPushUnique} */
    public static readonly pushUnique = arrayPushUnique;
    /** {@inheritDoc arrayRemoveMany} */
    public static readonly removeMany = arrayRemoveMany;
    /** {@inheritDoc arrayRemoveOne} */
    public static readonly removeOne = arrayRemoveOne;
    /** {@inheritDoc arrayReplaceOne} */
    public static readonly replaceOne = arrayReplaceOne;
    /** {@inheritDoc arraySetDifference} */
    public static readonly setDifference = arraySetDifference;
    /** {@inheritDoc arraySymmetricDifference} */
    public static readonly symmetricDifference = arraySymmetricDifference;
    /** {@inheritDoc arrayUnion} */
    public static readonly union = arrayUnion;
    /** {@inheritDoc arrayUnique} */
    public static readonly unique = arrayUnique;

    // noinspection JSUnusedLocalSymbols
    private constructor()
    {
    }
}
