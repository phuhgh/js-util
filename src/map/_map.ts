import { mapArrayMap } from "./impl/map-array-map";
import { mapFirstKey } from "./impl/map-first-key";
import { mapFirstValue } from "./impl/map-first-value";
import { mapInitializeGet } from "./impl/map-intialize-get";
import { mapKeysToArray } from "./impl/map-keys-to-array";
import { mapPush } from "./impl/map-push";
import { mapValuesToArray } from "./impl/map-values-to-array";
import { mapEntriesToArray } from "./impl/map-entries-to-array";
import { mapDeleteGet } from "./impl/map-delete-get";
import { mapAddToSet } from "./impl/map-add-to-set";
import { mapDeleteFromSet } from "./impl/map-delete-from-set";
import { mapReportingAddToSet } from "./impl/map-reporting-add-to-set";
import { mapRemoveManyFromArray } from "./impl/map-remove-many-from-array";
import { mapRemoveOneFromArray } from "./impl/map-remove-one-from-array";

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

    /** {@inheritDoc (mapDeleteFromSet: 1)} */
    public static readonly deleteFromSet = mapDeleteFromSet;

    /** {@inheritDoc (mapDeleteGet: 1)} */
    public static readonly deleteGet = mapDeleteGet;

    /** {@inheritDoc mapEntriesToArray} */
    public static readonly entriesToArray = mapEntriesToArray;

    /** {@inheritDoc mapFirstKey} */
    public static readonly firstKey = mapFirstKey;

    /** {@inheritDoc mapFirstValue} */
    public static readonly firstValue = mapFirstValue;

    /** {@inheritDoc (mapInitializeGet:1)} */
    public static readonly initializeGet = mapInitializeGet;

    /** {@inheritDoc mapKeysToArray} */
    public static readonly keysToArray = mapKeysToArray;

    /** {@inheritDoc (mapPush: 1)} */
    public static readonly push = mapPush;

    /** {@inheritDoc (mapReportingAddToSet: 1)} */
    public static readonly mapRemoveManyFromArray = mapRemoveManyFromArray;

    /** {@inheritDoc (mapRemoveOneFromArray: 1)} */
    public static readonly removeOneFromArray = mapRemoveOneFromArray;

    /** {@inheritDoc (mapReportingAddToSet: 1)} */
    public static readonly reportingAddToSet = mapReportingAddToSet;

    /** {@inheritDoc mapValuesToArray} */
    public static readonly valuesToArray = mapValuesToArray;

    private constructor()
    {
    }
}
