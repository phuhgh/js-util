import { debugFlags } from "./debug-flags";
import { IDictionary } from "../typescript/i-dictionary";
import "rc-js-util-globals/index";

/**
 * @public
 * Utilities for debug builds.
 */
// tslint:disable-next-line:class-name
export class _Debug
{
    /**
     * Convenience method to run multiple asserts.
     *
     * @returns A boolean value to make linting happy...
     *
     * @example
     * ```typescript
     * DEBUG_MODE && _Debug.runBlock(() => {
     *     _Debug.assert(someCondition, "someCondition was wrong");
     *     // ...
     * });
     * ```
     */
    public static runBlock(cb: () => void): boolean
    {
        cb();

        return true;
    }

    /**
     * Throws an `Error` with the given message if the condition is false.
     *
     * @returns A boolean value to make linting happy...
     *
     * @example
     * ```typescript
     * function foo(a1: number) {
     *     // not suitable for a production check, the programmer lied about the input type they supplied
     *     DEBUG_MODE && _Debug.assert(a1 != null, "a1 must be supplied");
     * }
     * ```
     *
     * @remarks
     * If `DEBUG_DISABLE_BREAKPOINT_FLAG` is false or unset then a breakpoint will be hit first.
     *
     *
     * Debug asserts are useful for providing hints to the programmer that they aren't meeting the contract of the API.
     */
    public static assert(condition: boolean, errorMessage: string): boolean
    {
        if (!condition)
        {
            if (!_Debug.isFlagSet(debugFlags.DEBUG_DISABLE_BREAKPOINT_FLAG))
            {
                // eslint-disable-next-line no-debugger
                debugger;
            }

            throw new Error(`assert fail: ${errorMessage}`);
        }

        return true;
    }

    /**
     * Throws an `Error` with the given message.
     * @returns A boolean value to make linting happy... will never return.
     *
     * @example
     * ```typescript
     * if (errorCondition) {
     *     // in debug mode we error
     *     DEBUG_MODE && _Debug.error("oopsy");
     *     // in production we fall back to some other behavior
     *     return errorConditionValue;
     * }
     * ```
     *
     * @remarks
     * If `DEBUG_MODE` is true and `DEBUG_DISABLE_BREAKPOINT_FLAG` is false or unset then a breakpoint will be hit first.
     */
    public static error(message: string): boolean
    {
        if (!_Debug.isFlagSet(debugFlags.DEBUG_DISABLE_BREAKPOINT_FLAG))
        {
            // eslint-disable-next-line no-debugger
            debugger;
        }

        throw new Error(message);
    }

    public static breakpoint(): boolean
    {
        // eslint-disable-next-line no-debugger
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

    /**
     * Used to set debug flags in an environment independent way.
     */
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

    /**
     * Used to get debug flags in an environment independent way.
     */
    public static isFlagSet<TKey extends keyof typeof debugFlags>(flag: typeof debugFlags[TKey]): boolean
    {
        return Boolean(_Debug.getGlobal()[flag]);
    }

    private static getGlobal(): IDictionary<unknown>
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

declare let global: IDictionary<unknown>;
declare let window: IDictionary<unknown>;