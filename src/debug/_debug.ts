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

    public static applyLabel<T>(this: void, label: string | undefined, callback: () => T): T
    {
        _Debug.label = label;
        const ret = callback();
        _Debug.label = undefined;

        return ret;
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
    public static configureBreakpoint(this: void, onBreakpoint: () => void): void
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
     * _BUILD.DEBUG && _Debug.runBlock(() => {
     *     _Debug.assert(someCondition, "someCondition was wrong");
     *     // ...
     * });
     * ```
     */
    public static runBlock(this: void, cb: () => void): boolean
    {
        cb();

        return true;
    }

    /**
     * Convenience method to run multiple asserts if flag set.
     *
     * @returns A boolean value to make linting happy...
     *
     * @remarks
     * Must still be hidden behind _BUILD.DEBUG check for dead code removal.
     *
     * @example
     * ```typescript
     * _BUILD.DEBUG && _Debug.conditionalBlock("SOME_FLAG", () => {
     *     _Debug.assert(someCondition, "someCondition was wrong");
     *     // ...
     * });
     * ```
     */
    public static conditionalBlock<TKey extends keyof IBuildConstants>
    (
        flag: TKey,
        cb: () => void,
    )
        : boolean
    {
        if (this.isFlagSet(flag))
        {
            cb();
        }

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
     *     _BUILD.DEBUG && _Debug.assert(a1 != null, "a1 must be supplied");
     * }
     * ```
     *
     * @remarks
     * If `_BUILD.DISABLE_BREAKPOINT_FLAG` is false or unset then a breakpoint will be hit first.
     *
     *
     * Debug asserts are useful for providing hints to the programmer that they aren't meeting the contract of the API.
     */
    public static assert(this: void, condition: boolean, errorMessage: string): boolean
    {
        if (!condition)
        {
            if (!_Debug.isFlagSet("DISABLE_BREAKPOINT"))
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
     *     _BUILD.DEBUG && _Debug.error("oopsy");
     *     // in production we fall back to some other behavior
     *     return errorConditionValue;
     * }
     * ```
     *
     * @remarks
     * If `_BUILD.DEBUG` is true and `_BUILD.DISABLE_BREAKPOINT` is false or unset then a breakpoint will be hit first.
     */
    public static error(this: void, message: string): boolean
    {
        if (!_Debug.isFlagSet("DISABLE_BREAKPOINT"))
        {
            _Debug.breakpoint();
        }

        throw new Error(message);
    }

    /**
     * Used in place of `debugger` statements when writing libraries. Should generally not be used directly.
     */
    public static breakpoint(this: void): boolean
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
     *     _BUILD.DEBUG && _Debug.verboseLog(`got me a ${a1}`);
     * }
     * ```
     */
    public static verboseLog(this: void, message: string, ancillaryObject?: object): void
    {
        if (!_Debug.isFlagSet("VERBOSE"))
        {
            return;
        }

        if (ancillaryObject == null)
        {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            console.debug(message);
        }
        else
        {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            console.debug(message, ancillaryObject);
        }
    }

    public static getStackTrace(this: void): string
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
    public static setFlag<TKey extends keyof IBuildConstants>
    (
        this: void,
        flag: TKey,
        value: boolean
    )
        : void
    {
        const build = (getGlobal()["_BUILD"] ??= {}) as IBuildConstants;
        build[flag] = value;
    }

    /**
     * Used to get debug flags in an environment independent way.
     */
    public static isFlagSet<TKey extends keyof IBuildConstants>
    (
        this: void,
        flag: TKey,
    )
        : boolean
    {
        const build = (getGlobal()["_BUILD"] ?? {}) as IBuildConstants;
        return build[flag] ?? false;
    }

    private static onBreakpoint = () =>
    {
        // eslint-disable-next-line no-debugger
        debugger;
    };

    private static _label: string | undefined = undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const console: any;

