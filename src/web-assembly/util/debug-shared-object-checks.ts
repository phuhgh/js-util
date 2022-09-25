import { _Debug } from "../../debug/_debug.js";
import { numberGetHexString } from "../../number/impl/number-get-hex-string.js";
import { stringNormalizeNullUndefinedToEmpty } from "../../string/impl/string-normalize-null-undefined-to-empty.js";
import { ISharedObject } from "../../lifecycle/i-shared-object.js";
import { IDebugProtectedView } from "../../debug/i-debug-protected-view.js";
import { IDebugAllocateListener } from "../../debug/i-debug-allocate-listener.js";

/**
 * @public
 * Provides life cycle and access checks for shared objects.
 *
 * @remarks
 * `ProtectedViews` will be invalidated any time a memory resize might occur with standard `_BUILD.DEBUG` set.
 *
 * On garbage collect of the javascript object, the associated WASM pointer is checked to see if it has been disposed of.
 */
export class DebugSharedObjectChecks
{
    /**
     * Calls register on the shared object but also registers the associated cleanup on release too.
     */
    public static registerWithCleanup
    (
        instance: IDebugAllocateListener & ISharedObject,
        protectedView: IDebugProtectedView,
        nameOfInstance: string,
    )
        : IDebugProtectedView
    {
        instance.sharedObject.registerOnFreeListener(() => DebugSharedObjectChecks.unregister(protectedView, instance, nameOfInstance));
        return DebugSharedObjectChecks.register(instance, protectedView, nameOfInstance);
    }

    public static register
    (
        instance: IDebugAllocateListener & ISharedObject,
        protectedView: IDebugProtectedView,
        nameOfInstance: string,
    )
        : IDebugProtectedView
    {
        if (instance.debugOnAllocate == null)
        {
            instance.debugOnAllocate = () => protectedView.invalidate();
        }

        const debug = protectedView.owningInstance.debug;
        debug.protectedViews.setValue(instance, protectedView);
        debug.sharedObjectLifeCycleChecks.registerFinalizationCheck(instance.sharedObject);
        debug.onAllocate.addListener(instance);

        if (!instance.sharedObject.isStatic && _Debug.isFlagSet("VERBOSE_MEMORY_MANAGEMENT"))
        {
            // stringifying the stack would be far too verbose, most debuggers allow expansion of objects...
            const allocationStack = { stack: _Debug.getStackTrace() };
            const type = instance.sharedObject.isStatic ? "static" : "instance";
            const message = `claimed (${type}) ${nameOfInstance} ${numberGetHexString(instance.sharedObject.getPtr())} - ${stringNormalizeNullUndefinedToEmpty(_Debug.label)}`;
            _Debug.verboseLog(message, allocationStack);
        }

        return protectedView;
    }

    public static unregister
    (
        protectedView: IDebugProtectedView,
        instance: { debugOnAllocate?: () => void } & ISharedObject,
        nameOfInstance: string,
    )
        : void
    {
        const debug = protectedView.owningInstance.debug;
        debug.sharedObjectLifeCycleChecks.markReadyForFinalize(instance.sharedObject);
        debug.protectedViews
            .getValue(instance)
            .invalidate();
        debug.protectedViews.deleteValue(instance);
        instance.debugOnAllocate = () => undefined;
        debug.onAllocate.removeListener(instance);

        if (!instance.sharedObject.isStatic && _Debug.isFlagSet("VERBOSE_MEMORY_MANAGEMENT"))
        {
            const type = instance.sharedObject.isStatic ? "static" : "instance";
            const address = numberGetHexString(instance.sharedObject.getPtr());
            const label = stringNormalizeNullUndefinedToEmpty(_Debug.label);
            _Debug.verboseLog(`released (${type}) ${nameOfInstance} ${address} - ${label}`);
        }
    }
}