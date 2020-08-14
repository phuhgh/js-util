import { arrayBinaryIndexOf } from "./impl/array-binary-index-of";
import { arrayIndexByKey } from "./impl/array-index-by-key";
import { arrayIsArray } from "./impl/array-is-array";
import { arrayBinaryLastIndexOf } from "./impl/array-binary-last-index-of";
import { arrayMap } from "./impl/array-map";

// tslint:disable-next-line:class-name
export class _Array
{
    public static readonly binaryIndexOf = arrayBinaryIndexOf;
    public static readonly binaryLastIndexOf = arrayBinaryLastIndexOf;
    public static readonly isArray = arrayIsArray;
    public static readonly indexByKey = arrayIndexByKey;
    public static readonly map = arrayMap;

    private constructor()
    {
    }
}
