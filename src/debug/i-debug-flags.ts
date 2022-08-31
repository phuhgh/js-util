export interface IDebugFlags
{
    /**
     * This can be set in dead code removal tools to trim debug code. Unlike other flags, this should always be defined.
     */
    DEBUG: boolean;
    /**
     * Prevents hitting assert / error breakpoints, useful when debugging tests.
     */
    DISABLE_BREAKPOINT?: boolean;
    /**
     * Enable verbose logging.
     */
    VERBOSE?: boolean;
    /**
     * Disable debug checks that do not run in constant time.
     */
    DISABLE_EXPENSIVE_CHECKS?: boolean;
    /**
     * Enable verbose logging of memory allocations, very chatty.
     */
    VERBOSE_MEMORY_MANAGEMENT?: boolean;
}