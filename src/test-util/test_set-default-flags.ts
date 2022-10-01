import { _Debug } from "../debug/_debug.js";

/**
 * @public
 */
export function Test_setDefaultFlags(): void
{
    _Debug.setFlag("DEBUG", true);
    _Debug.setFlag("DISABLE_BREAKPOINT", true);
}