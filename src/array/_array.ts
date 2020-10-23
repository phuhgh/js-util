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

// tslint:disable-next-line:class-name
export class _Array
{
    public static readonly binaryIndexOf = arrayBinaryIndexOf;
    public static readonly binaryLastIndexOf = arrayBinaryLastIndexOf;
    public static readonly collect = arrayCollect;
    public static readonly copyInto = arrayCopyInto;
    public static readonly flatMap = arrayFlatMap;
    public static readonly forEach = arrayForEach;
    public static readonly index = arrayIndex;
    public static readonly intersect = arrayIntersect;
    public static readonly isArray = arrayIsArray;
    public static readonly last = arrayLast;
    public static readonly map = arrayMap;
    public static readonly normalizeEmptyToUndefined = arrayNormalizeEmptyToUndefined;
    public static readonly normalizeNullUndefinedToEmpty = arrayNormalizeNullUndefinedToEmpty;
    public static readonly removeMany = arrayRemoveMany;
    public static readonly removeOne = arrayRemoveOne;
    public static readonly replaceOne = arrayReplaceOne;

    private constructor()
    {
    }
}
