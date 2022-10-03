import { getGlobal } from "../runtime/get-global.js";
import { IReferenceCounted } from "../lifecycle/a-reference-counted.js";

/**
 * @public
 */
export function Test_resetLifeCycle(): void
{
    // todo jack: hack
    (getGlobal()["RC_ALLOCATION_STACK"] as IReferenceCounted[][] ?? []).length = 0;
}