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

        /**
         * Enable verbose logging.
         */
        DEBUG_VERBOSE: "DEBUG_VERBOSE" as const,

        /**
         * Disable debug checks that do not run in constant time.
         */
        DEBUG_DISABLE_EXPENSIVE_CHECKS: "DEBUG_DISABLE_EXPENSIVE_CHECKS" as const,

        /**
         * Checks that are a wee bit autistic.
         */
        DEBUG_PEDANTIC: "DEBUG_PEDANTIC" as const,

        /**
         * Enable verbose logging of memory allocations, very chatty.
         */
        DEBUG_VERBOSE_MEMORY_MANAGEMENT: "DEBUG_VERBOSE_MEMORY_MANAGEMENT" as const,
    };