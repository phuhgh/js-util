/**
 * @public
 * Flags that can be stripped by dead code removal tools. Shouldn't be used in production.
 */
export const debugFlags =
    {
        /**
         * This can be set in dead code removal tools to trim debug code.
         */
        DEBUG_MODE_FLAG: "DEBUG_MODE" as const,
        /**
         * Prevents hitting assert / error breakpoints, useful when debugging tests.
         */
        DEBUG_DISABLE_BREAKPOINT_FLAG: "DEBUG_DISABLE_BREAKPOINT" as const,
    };