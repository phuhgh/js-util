import { _Debug } from "../debug/_debug";
import { debugFlags } from "../debug/debug-flags";

/**
 * @public
 * Utilities for production builds.
 */
// tslint:disable-next-line:class-name
export class _Production
{
    /**
     * Throws an `Error` with the given message. If `DEBUG_MODE` is true and `DEBUG_DISABLE_BREAKPOINT_FLAG` is false or unset then a breakpoint will be hit first.
     */
    public static error(message: string): never
    {
        if (DEBUG_MODE)
        {
            if (!_Debug.isFlagSet(debugFlags.DEBUG_DISABLE_BREAKPOINT_FLAG))
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
        _Production.error("unexpected code path executed");
    }
}