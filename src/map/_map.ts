import { mapArrayMap } from "./impl/map-array-map";
import { mapFirstKey } from "./impl/map-first-key";
import { mapFirstValue } from "./impl/map-first-value";
import { mapInitializeGet } from "./impl/map-intialize-get";
import { mapKeysToArray } from "./impl/map-keys-to-array";
import { mapPush } from "./impl/map-push";
import { mapValuesToArray } from "./impl/map-values-to-array";

// tslint:disable-next-line:class-name
export class _Map
{
    public static readonly arrayMap = mapArrayMap;
    public static readonly firstKey = mapFirstKey;
    public static readonly firstValue = mapFirstValue;
    public static readonly initializeGet = mapInitializeGet;
    public static readonly keysToArray = mapKeysToArray;
    public static readonly push = mapPush;
    public static readonly valuesToArray = mapValuesToArray;

    private constructor()
    {
    }
}
