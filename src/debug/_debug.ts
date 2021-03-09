import { debugFlags } from "./debug-flags";
import { getGlobal } from "../runtime/get-global";

/**
 * @public
 * Utilities for debug builds.
 */
export class _Debug
{
    public static get label(): string | undefined
    {
        return _Debug._label;
    }

    public static set label(label: string | undefined)
    {
        _Debug._label = label;
    }

    /**
     * Most debuggers will ignore `debugger` statements in node_modules.
     * Skirt around this by letting the consumer set their own callback for this.
     *
     * @param onBreakpoint - called on debug assert etc, you should provide a function with a `debugger` statement.
     *
     * @example
     * ```typescript
     * // the braces are not optional
     * _Debug.configureBreakpoint(() => { debugger; })
     * ```
     */
    public static configureBreakpoint(onBreakpoint: () => void): void
    {
        _Debug.onBreakpoint = onBreakpoint;
    }

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
                _Debug.breakpoint();
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
            _Debug.breakpoint();
        }

        throw new Error(message);
    }

    /**
     * Used in place of `debugger` statements when writing libraries. Should generally not be used directly.
     */
    public static breakpoint(): boolean
    {
        _Debug.onBreakpoint();

        return true;
    }

    /**
     * Logging which can be conditionally enabled by setting `DEBUG_VERBOSE` to true.
     *
     * @example
     * ```typescript
     * function foo(a1: number) {
     *     DEBUG_MODE && _Debug.verboseLog(`got me a ${a1}`);
     * }
     * ```
     */
    public static verboseLog(message: string): void
    {
        if (!_Debug.isFlagSet(debugFlags.DEBUG_VERBOSE))
        {
            return;
        }

        console.debug(message);
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
        getGlobal()[flag] = value;
    }

    public static setCustomFlag(flag: string, value: boolean): void
    {
        getGlobal()[flag] = value;
    }

    /**
     * Used to get debug flags in an environment independent way.
     */
    public static isFlagSet<TKey extends keyof typeof debugFlags>(flag: typeof debugFlags[TKey]): boolean
    {
        return Boolean(getGlobal()[flag]);
    }

    private static onBreakpoint = () =>
    {
        // eslint-disable-next-line no-debugger
        debugger;
    }

    private static _label: string | undefined = undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const console: any;