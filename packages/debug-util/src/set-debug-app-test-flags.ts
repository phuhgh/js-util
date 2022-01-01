import { _Debug } from "../_debug";

export function setDefaultAppTestFlags(): void
{
    _Debug.setFlag("DEBUG_MODE", true);
    _Debug.setFlag("DEBUG_VERBOSE", true);
}