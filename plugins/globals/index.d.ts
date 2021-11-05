/**
 * @public
 * A weakmap store available in debug contexts only.
 */
export interface IDebugWeakStore<T>
{
    setValue(key: object, value: T): void;
    deleteValue(listener: object): void;
    getValue(key: object): T;
}

/**
 * @public
 * See {@link ISharedObject}.
 */
export interface IDebugSharedObject
{
    isStatic: boolean;
    getPtr(): number;
}

/**
 * @public
 */
export type TDebugListener<K extends string, TArgs extends unknown[]> = {
    [P in K]?: (...args: TArgs) => void;
};

/**
 * @public
 * Like {@link IBroadcastEvent} but without holding strong references. Available in debug contexts only.
 */
export interface IDebugWeakBroadcastEvent<K extends string, TArgs extends unknown[]>
{
    addListener(listener: TDebugListener<K, TArgs>): void;
    addTemporaryListener(listener: TDebugListener<K, TArgs>): () => void;
    removeListener(listener: TDebugListener<K, TArgs>): void;
    emit(...args: TArgs): void;
}

/**
 * @public
 * Wrapper of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry|FinalizationRegistry} for shared objects, useful for checking if the shared object was properly disposed.
 * Available in debug contexts only.
 */
export interface IDebugSharedObjectLifeCycleChecks
{
    registerFinalizationCheck(sharedObject: IDebugSharedObject): void;
    markReadyForFinalize(sharedObject: IDebugSharedObject): void;
}

/**
 * @public
 * Factory for creating proxy objects that can be invalidated later. Once invalidated any property
 * read that wasn't explicitly marked safe will cause a debug error. Available in debug contexts only.
 */
export interface IDebugProtectedView<_T extends object>
{
    /**
     * Invalidates all previous views.
     */
    invalidate(): void;
    /**
     * Create a proxy to the view, if invalidate called then access of non `safeKeys` will cause a debug error.
     */
    createProtectedView<T extends object>(view: T): T;
}

/**
 * @public
 * The debug flags included with rc-js-util
 */
export interface IStandardDebugFlags
{
    /**
     * This can be set in dead code removal tools to trim debug code.
     */
    DEBUG_MODE: "DEBUG_MODE",
    /**
     * Prevents hitting assert / error breakpoints, useful when debugging tests.
     */
    DEBUG_DISABLE_BREAKPOINT: "DEBUG_DISABLE_BREAKPOINT";
    /**
     * Enable verbose logging.
     */
    DEBUG_VERBOSE: "DEBUG_VERBOSE";
    /**
     * Disable debug checks that do not run in constant time.
     */
    DEBUG_DISABLE_EXPENSIVE_CHECKS: "DEBUG_DISABLE_EXPENSIVE_CHECKS";
    /**
     * Enable verbose logging of memory allocations, very chatty.
     */
    DEBUG_VERBOSE_MEMORY_MANAGEMENT: "DEBUG_VERBOSE_MEMORY_MANAGEMENT";
}

declare global
{
    /**
     * This can be set in dead code removal tools to trim debug code.
     */
    const DEBUG_MODE: boolean;
    /**
     * Prevents hitting assert / error breakpoints, useful when debugging tests.
     */
    const DEBUG_DISABLE_BREAKPOINT: boolean;
    /**
     * Enable verbose logging.
     */
    const DEBUG_VERBOSE: boolean;
    /**
     * Disable debug checks that do not run in constant time.
     */
    const DEBUG_DISABLE_EXPENSIVE_CHECKS: boolean;
    /**
     * Enable verbose logging of memory allocations, very chatty.
     */
    const DEBUG_VERBOSE_MEMORY_MANAGEMENT: boolean;

    /**
     * Debug state, only present in debug builds. All accesses should be hidden behind DEBUG_MODE checks.
     */
    namespace RcJsUtilDebug
    {
        export const onAllocate: IDebugWeakBroadcastEvent<"debugOnAllocate", []>;
        export const protectedViews: IDebugWeakStore<IDebugProtectedView<object>>;
        export const error: (message: string) => void;
        export const sharedObjectLifeCycleChecks: IDebugSharedObjectLifeCycleChecks;
        export const uniquePointers: Set<number>;
    }

    interface RcJsUtilDebugFlags extends IStandardDebugFlags
    {
    }
}