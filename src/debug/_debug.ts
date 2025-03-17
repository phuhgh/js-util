import { getGlobal } from "../runtime/get-global.js";
import { arrayAddToSet } from "../array/impl/array-add-to-set.js";
import { setValuesToArray } from "../set/impl/set-values-to-array.js";
import { stringConcat2 } from "../string/impl/string-concat-2.js";

/**
 * @public
 * Utilities for debug builds.
 */
export class _Debug
{
    public static get label(): string | undefined
    {
        logDebugMisuse();

        return _Debug._label;
    }

    public static set label(label: string | undefined)
    {
        logDebugMisuse();

        _Debug._label = label;
    }

    public static applyLabel<T>(this: void, label: string | undefined, callback: () => T): T
    {
        _Debug.label = label;
        const ret = callback();
        _Debug.label = undefined;

        return ret;
    }

    public static labelBlock<T>(this: void, label: string | undefined): (callback: () => T) => T
    {
        return (callback: () => T) =>
        {
            if (_Debug.label != null && label != null)
            {
                label = stringConcat2(_Debug.label, label, "\n");
            }
            return _Debug.applyLabel(label, callback);
        };
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
        logDebugMisuse();

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
        logDebugMisuse();

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
        logDebugMisuse();

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
        logDebugMisuse();

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
     * Logging which can be conditionally enabled by setting either `VERBOSE` to true on build options (enabling everything),
     * or by calling setLoggingTags and specifying which tags you'd like enabled.
     *
     * @example
     * ```typescript
     * function foo(a1: number) {
     *     _BUILD.DEBUG && _Debug.verboseLog(`got me a ${a1}`);
     * }
     * ```
     */
    public static verboseLog(this: void, tags: readonly string[], message: string, ancillaryObject?: object): void
    {
        logDebugMisuse();
        arrayAddToSet(tags, _Debug._seenTags);

        if (!_Debug.isFlagSet("VERBOSE"))
        {
            return;
        }

        // by default, all logging is enabled
        const enabledTags = _Debug._enabledTags;
        if (enabledTags != null && !tags.some(tag => enabledTags.has(tag)))
        {
            return;
        }

        // if any tag is disabled, the message should not be logged
        const disabledTags = _Debug._disabledTags;
        if (disabledTags != null && tags.some(tag => disabledTags.has(tag)))
        {
            return;
        }

        const tagString = tags.length > 0 ? ["[", tags.join(", "), "]"].join("") : "";
        const labelString = _Debug.label == null ? "" : [_Debug.label, ":"].join("");
        const prefix = [tagString, labelString].join(" ").trim();
        const prefixedMessage = [prefix, message]
            .join(" ")
            .trimStart();

        if (ancillaryObject == null)
        {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            console.debug(prefixedMessage);
        }
        else
        {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            console.debug(prefixedMessage, ancillaryObject);
        }
    }

    public static logError(this: void, message: string | object): void
    {
        logDebugMisuse();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        console.error(message);
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

    public static setEnabledLoggingTags(this: void, tags: string[]): void
    {
        _Debug._enabledTags = tags.length === 0 ? null : new Set(tags);
        _Debug._disabledTags = null;
    }

    public static setDisabledLoggingTags(this: void, tags: string[]): void
    {
        _Debug._enabledTags = null;
        _Debug._disabledTags = tags.length === 0 ? null : new Set(tags);
    }

    /**
     * @returns The tags that have been seen so far. Tags will be added as `verboseLog` is called....
     */
    public static getTags(): string[]
    {
        return setValuesToArray(this._seenTags);
    }

    private static onBreakpoint = () =>
    {
        // eslint-disable-next-line no-debugger
        debugger;
    };

    private static _label: string | undefined = undefined;
    private static _enabledTags: Set<string> | null = null;
    private static _disabledTags: Set<string> | null = null;
    private static _seenTags = new Set<string>();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const console: any;

// not every part of _Debug should be used outside _BUILD.DEBUG builds
function logDebugMisuse(): void
{
    if (!_BUILD.DEBUG)
    {
        // ideally we'd throw, but making the program less "strict" in a production build would be a source of disgustingly awful bugs
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        console.error("_Debug was called outside of a debug build, you should consider this an error. Use _Production instead.");
    }
}

