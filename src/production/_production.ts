import { _Debug } from "../debug/_debug";

/**
 * @public
 * Utilities for production builds.
 */
export class _Production
{
    /**
     * Throws an `Error` with the given message. If `DEBUG_MODE` is true and `DEBUG_DISABLE_BREAKPOINT_FLAG` is false or unset then a breakpoint will be hit first.
     * Should not be used for "expected" errors (bad input etc).
     */
    public static error(message: string): never
    {
        if (DEBUG_MODE)
        {
            if (!_Debug.isFlagSet("DEBUG_DISABLE_BREAKPOINT"))
            {
                _Debug.breakpoint();
            }
        }

        throw new Error(message);
    }

    /**
     * A function that will error if ever called. The parameter is asserted to be never, useful with switch statements, union types etc.
     *
     * @example
     * ```typescript
     * // adding extra values to the enum will cause a compiler error
     * enum ETest { Foo = 1 };
     * function test(value: ETest)
     * {
     *      switch (value) {
     *          case ETest.Foo: return "potato";
     *          default: return _Production.assertValueIsNever(value);
     *      }
     * }
     * ```
     */
    public static assertValueIsNever(_value: never): never
    {
        _Production.error("unexpected code path executed.");
    }
}