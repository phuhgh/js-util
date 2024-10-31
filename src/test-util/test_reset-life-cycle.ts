import { getGlobal } from "../runtime/get-global.js";
import type { IManagedResourceNode } from "../lifecycle/manged-resources.js";


/**
 * @public
 */
export function Test_resetLifeCycle(): void
{
    (getGlobal()["RC_ALLOCATION_STACK"] as IManagedResourceNode[][] ?? []).length = 0;
}