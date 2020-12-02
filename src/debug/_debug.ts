import { debugFlags } from "./debug-flags";
import { IDictionary } from "../typescript/i-dictionary";
import "rc-js-util-globals/index";

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

    public static breakpoint(): boolean
    {
        // tslint:disable-next-line:no-debugger
        debugger;

        return true;
    }

    public static getStackTrace(): string
    {
        const error = new Error();
        let stack = error.stack;

        if (stack == null)
        {
            try
            {
                // noinspection ExceptionCaughtLocallyJS
                throw error;
            }
            catch (e)
            {
                stack = (e as Error).stack as string;
            }
        }

        return stack.toString();
    }

    public static setFlag<TKey extends keyof typeof debugFlags>
    (
        flag: typeof debugFlags[TKey],
        value: boolean
    )
        : void
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