import { _Debug } from "../_debug";

export function setDefaultUnitTestFlags(): void
{
    _Debug.setFlag("DEBUG_MODE", true);
    _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
}
