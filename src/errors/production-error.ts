import { _Debug } from "../debug/_debug";
import { debugFlags } from "../debug/debug-flags";

export class ProductionError
{
    public static createOne(message: string): Error
    {
        if (DEBUG_MODE)
        {
            if (!_Debug.isFlagSet(debugFlags.DEBUG_DISABLE_BREAKPOINT_FLAG))
            {
                // tslint:disable-next-line
                debugger;
            }
        }

        return new Error(message);
    }
}