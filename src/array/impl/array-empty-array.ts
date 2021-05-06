import { _Debug } from "../../debug/_debug";

/**
 * @public
 * An empty readonly array, useful to avoid GC pressure.
 */
export const arrayEmptyArray: readonly [] = [];

DEBUG_MODE && _Debug.runBlock(() =>
{
    Object.freeze(arrayEmptyArray);
});