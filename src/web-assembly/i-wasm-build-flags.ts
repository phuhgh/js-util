/**
 * @public
 */
export interface IWasmBuildFlags
{
    /**
     * By default, {@link blockScopedLifecycle} runs in a try catch, so that any objects that are allocated will always be
     * properly cleaned up. Disabled if true.
     */
    WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH?: boolean;
    // have modules been built with the address sanitizer on?
    ASAN?: boolean;
}