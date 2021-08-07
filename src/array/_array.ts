import { arrayBinaryIndexOf } from "./impl/array-binary-index-of";
import { arrayIsArray } from "./impl/array-is-array";
import { arrayBinaryLastIndexOf } from "./impl/array-binary-last-index-of";
import { arrayMap } from "./impl/array-map";
import { arrayCopyInto } from "./impl/array-copy-into";
import { arrayFlatMap } from "./impl/array-flat-map";
import { arrayForEach } from "./impl/array-for-each";
import { arrayIndex } from "./impl/array-index";
import { arrayIntersect } from "./impl/array-intersect";
import { arrayLast } from "./impl/array-last";
import { arrayNormalizeEmptyToUndefined } from "./impl/array-normalize-empty-to-undefined";
import { arrayNormalizeNullishToEmpty } from "./impl/array-normalize-nullish-to-empty";
import { arrayCollect } from "./impl/array-collect";
import { arrayRemoveMany } from "./impl/array-remove-many";
import { arrayRemoveOne } from "./impl/array-remove-one";
import { arrayReplaceOne } from "./impl/array-replace-one";
import { arrayCompact } from "./impl/array-compact";
import { arrayCompactMap } from "./impl/array-compact-map";
import { arrayUnion } from "./impl/array-union";
import { arrayPushUnique } from "./impl/array-push-unique";
import { arrayEmptyArray } from "./impl/array-empty-array";
import { arrayGenerateRange } from "./impl/array-generate-range";
import { arrayMapRange } from "./impl/array-map-range";
import { arrayContains } from "./impl/array-contains";
import { arrayInsertAtIndex } from "./impl/array-insert-at-index";

/**
 * @public
 * Utilities that apply to `Array` and `ArrayLike`.
 */
export class _Array
{
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
    /** {@inheritDoc arrayLast} */
    public static readonly last = arrayLast;
    /** {@inheritDoc arrayMap} */
    public static readonly map = arrayMap;
    /** {@inheritDoc arrayMapRange} */
    public static readonly mapRange = arrayMapRange;
    /** {@inheritDoc arrayNormalizeEmptyToUndefined} */
    public static readonly normalizeEmptyToUndefined = arrayNormalizeEmptyToUndefined;
    /** {@inheritDoc arrayNormalizeNullUndefinedToEmpty} */
    public static readonly normalizeNullishToEmpty = arrayNormalizeNullishToEmpty;
    /** {@inheritDoc arrayPushUnique} */
    public static readonly pushUnique = arrayPushUnique;
    /** {@inheritDoc arrayRemoveMany} */
    public static readonly removeMany = arrayRemoveMany;
    /** {@inheritDoc arrayRemoveOne} */
    public static readonly removeOne = arrayRemoveOne;
    /** {@inheritDoc arrayReplaceOne} */
    public static readonly replaceOne = arrayReplaceOne;
    /** {@inheritDoc arrayUnion} */
    public static readonly union = arrayUnion;

    private constructor()
    {
    }
}
