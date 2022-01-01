import { _Debug } from "@rc-js-util/debug";

export function setDefaultUnitTestFlags(): void
{
    _Debug.setFlag("DEBUG_MODE", true);
    _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
}
