import { mapArrayMap } from "./impl/map-array-map";
import { mapFirstKey } from "./impl/map-first-key";
import { mapFirstValue } from "./impl/map-first-value";
import { mapInitializeGet } from "./impl/map-intialize-get";
import { mapKeysToArray } from "./impl/map-keys-to-array";
import { mapPush } from "./impl/map-push";
import { mapValuesToArray } from "./impl/map-values-to-array";
import { mapEntriesToArray } from "./impl/map-entries-to-array";

/**
 * @public
 * Utilities that apply to `Map`.
 */
export class _Map
{
    /** {@inheritDoc mapArrayMap} */
    public static readonly arrayMap = mapArrayMap;

    /** {@inheritDoc mapEntriesToArray} */
    public static readonly entriesToArray = mapEntriesToArray;

    /** {@inheritDoc mapFirstKey} */
    public static readonly firstKey = mapFirstKey;

    /** {@inheritDoc mapFirstValue} */
    public static readonly firstValue = mapFirstValue;

    /** {@inheritDoc mapInitializeGet} */
    public static readonly initializeGet = mapInitializeGet;

    /** {@inheritDoc mapKeysToArray} */
    public static readonly keysToArray = mapKeysToArray;

    /** {@inheritDoc mapPush} */
    public static readonly push = mapPush;

    /** {@inheritDoc mapValuesToArray} */
    public static readonly valuesToArray = mapValuesToArray;

    private constructor()
    {
    }
}
