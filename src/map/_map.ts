import { mapArrayMap } from "./impl/map-array-map.js";
import { mapFirstKey } from "./impl/map-first-key.js";
import { mapFirstValue } from "./impl/map-first-value.js";
import { mapInitializeGet } from "./impl/map-intialize-get.js";
import { mapKeysToArray } from "./impl/map-keys-to-array.js";
import { mapPush } from "./impl/map-push.js";
import { mapValuesToArray } from "./impl/map-values-to-array.js";
import { mapEntriesToArray } from "./impl/map-entries-to-array.js";
import { mapDeleteGet } from "./impl/map-delete-get.js";
import { mapAddToSet } from "./impl/map-add-to-set.js";
import { mapDeleteFromSet } from "./impl/map-delete-from-set.js";
import { mapReportingAddToSet } from "./impl/map-reporting-add-to-set.js";
import { mapRemoveManyFromArray } from "./impl/map-remove-many-from-array.js";
import { mapRemoveOneFromArray } from "./impl/map-remove-one-from-array.js";
import { mapSetDifference } from "./impl/map-set-difference.js";
import { mapSymmetricDifference } from "./impl/map-symmetric-difference.js";
import { mapUnion } from "./impl/map-union.js";
import { mapIntersect } from "./impl/map-intersect.js";
import { mapConcat } from "./impl/map-concat.js";
import { mapClearingDeleteFromSet } from "./impl/map-clearing-delete-from-set.js";

/**
 * @public
 * Utilities that apply to `Map`.
 */
export class _Map
{
    /** {@inheritDoc (mapAddToSet: 1)} */
    public static readonly addToSet = mapAddToSet;

    /** {@inheritDoc mapArrayMap} */
    public static readonly arrayMap = mapArrayMap;

    /** {@inheritDoc (mapConcat: 1)} */
    public static readonly concat = mapConcat;

    /** {@inheritDoc (mapDeleteFromSet: 1)} */
    public static readonly deleteFromSet = mapDeleteFromSet;

    /** {@inheritDoc (mapDeleteGet: 1)} */
    public static readonly deleteGet = mapDeleteGet;

    /** {@inheritDoc (mapClearingDeleteFromSet: 1)} */
    public static readonly clearingDeleteFromSet = mapClearingDeleteFromSet;

    /** {@inheritDoc mapEntriesToArray} */
    public static readonly entriesToArray = mapEntriesToArray;

    /** {@inheritDoc mapFirstKey} */
    public static readonly firstKey = mapFirstKey;

    /** {@inheritDoc mapFirstValue} */
    public static readonly firstValue = mapFirstValue;

    /** {@inheritDoc mapIntersect} */
    public static readonly intersect = mapIntersect;

    /** {@inheritDoc (mapInitializeGet:1)} */
    public static readonly initializeGet = mapInitializeGet;

    /** {@inheritDoc mapKeysToArray} */
    public static readonly keysToArray = mapKeysToArray;

    /** {@inheritDoc (mapPush: 1)} */
    public static readonly push = mapPush;

    /** {@inheritDoc (mapReportingAddToSet: 1)} */
    public static readonly removeManyFromArray = mapRemoveManyFromArray;

    /** {@inheritDoc (mapRemoveOneFromArray: 1)} */
    public static readonly removeOneFromArray = mapRemoveOneFromArray;

    /** {@inheritDoc (mapReportingAddToSet: 1)} */
    public static readonly reportingAddToSet = mapReportingAddToSet;

    /** {@inheritDoc mapSetDifference} */
    public static readonly setDifference = mapSetDifference;

    /** {@inheritDoc mapSymmetricDifference} */
    public static readonly symmetricDifference = mapSymmetricDifference;

    /** {@inheritDoc mapUnion} */
    public static readonly union = mapUnion;

    /** {@inheritDoc mapValuesToArray} */
    public static readonly valuesToArray = mapValuesToArray;

    private constructor()
    {
    }
}
