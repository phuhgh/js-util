import { _Debug } from "@rc-js-util/debug";

export function setDefaultAppTestFlags(): void
{
    _Debug.setFlag("DEBUG_MODE", true);
    _Debug.setFlag("DEBUG_VERBOSE", true);
}