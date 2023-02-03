import { getGlobal } from "../runtime/get-global.js";
import { IReferenceCounted } from "../lifecycle/a-reference-counted.js";

/**
 * @public
 */
export function Test_resetLifeCycle(): void
{
    (getGlobal()["RC_ALLOCATION_STACK"] as IReferenceCounted[][] ?? []).length = 0;
}