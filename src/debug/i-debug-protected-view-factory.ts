import type { TListener } from "../eventing/t-listener.js";

/**
 * @public
 * Factory for creating proxy objects that can be invalidated later. Once invalidated any property
 * read that wasn't explicitly marked safe will cause a debug error. Available in debug contexts only.
 */
export interface IDebugProtectedViewFactory extends TListener<"debugOnAllocate", []>
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