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
import { arrayNormalizeNullUndefinedToEmpty } from "./impl/array-normalize-null-undefined-to-empty";
import { arrayCollect } from "./impl/array-collect";
import { arrayRemoveMany } from "./impl/array-remove-many";
import { arrayRemoveOne } from "./impl/array-remove-one";
import { arrayReplaceOne } from "./impl/array-replace-one";
import { arrayCompact } from "./impl/array-compact";
import { arrayCompactMap } from "./impl/array-compact-map";
import { arrayUnion } from "./impl/array-union";
import { arrayPushUnique } from "./impl/array-push-unique";

/**
 * @public
 * Utilities that apply to `Array` and `ArrayLike`.
 */
// tslint:disable-next-line:class-name
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
    /** {@inheritDoc arrayCopyInto} */
    public static readonly copyInto = arrayCopyInto;
    /** {@inheritDoc arrayFlatMap} */
    public static readonly flatMap = arrayFlatMap;
    /** {@inheritDoc arrayForEach} */
    public static readonly forEach = arrayForEach;
    /** {@inheritDoc arrayIndex} */
    public static readonly index = arrayIndex;
    /** {@inheritDoc arrayIntersect} */
    public static readonly intersect = arrayIntersect;
    /** {@inheritDoc arrayIsArray} */
    public static readonly isArray = arrayIsArray;
    /** {@inheritDoc arrayLast} */
    public static readonly last = arrayLast;
    /** {@inheritDoc arrayMap} */
    public static readonly map = arrayMap;
    /** {@inheritDoc arrayNormalizeEmptyToUndefined} */
    public static readonly normalizeEmptyToUndefined = arrayNormalizeEmptyToUndefined;
    /** {@inheritDoc arrayNormalizeNullUndefinedToEmpty} */
    public static readonly normalizeNullUndefinedToEmpty = arrayNormalizeNullUndefinedToEmpty;
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
