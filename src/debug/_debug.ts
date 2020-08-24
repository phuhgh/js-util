import { debugFlags } from "./debug-flags";
import { IDictionary } from "../i-dictionary";

declare global
{
    export const DEBUG_MODE: boolean;
    export const DEBUG_DISABLE_BREAKPOINT: boolean;
}

// tslint:disable-next-line:class-name
export class _Debug
{
    public static runBlock(cb: () => void): boolean
    {
        cb();

        return true;
    }

    public static assert(condition: boolean, errorMessage: string): boolean
    {
        if (!condition)
        {
            if (!_Debug.isFlagSet(debugFlags.DEBUG_DISABLE_BREAKPOINT_FLAG))
            {
                // tslint:disable-next-line
                debugger;
            }

            throw new Error(`assert fail: ${errorMessage}`);
        }

        return true;
    }

    public static error(message: string): boolean
    {
        if (!_Debug.isFlagSet(debugFlags.DEBUG_DISABLE_BREAKPOINT_FLAG))
        {
            // tslint:disable-next-line
            debugger;
        }

        throw new Error(message);
    }

    public static setFlag<TKey extends keyof typeof debugFlags>(flag: typeof debugFlags[TKey], value: boolean): void
    {
        _Debug.getGlobal()[flag] = value;
    }

    public static setCustomFlag(flag: string, value: boolean): void
    {
        _Debug.getGlobal()[flag] = value;
    }

    public static isFlagSet<TKey extends keyof typeof debugFlags>(flag: typeof debugFlags[TKey]): boolean
    {
        return Boolean(_Debug.getGlobal()[flag]);
    }

    private static getGlobal(): IDictionary<any>
    {
        if (typeof global !== "undefined")
        {
            return global;
        }

        if (typeof window !== "undefined")
        {
            return window;
        }

        throw new Error("unsupported environment");
    }
}

declare var global: IDictionary<any>;
declare var window: IDictionary<any>;