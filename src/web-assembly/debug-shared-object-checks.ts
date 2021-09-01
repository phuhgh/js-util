import { _Debug } from "../debug/_debug";
import { numberGetHexString } from "../number/impl/number-get-hex-string";
import { stringNormalizeNullUndefinedToEmpty } from "../string/impl/string-normalize-null-undefined-to-empty";
import { IDebugProtectedView } from "rc-js-util-globals";
import { ISharedObject } from "../lifecycle/i-shared-object";

/**
 * @public
 * Provides life cycle and access checks for shared objects.
 *
 * @remarks
 * Requires `DEBUG_PEDANTIC` to be set for GC checks to be run. `ProtectedViews` will be invalidated any time a memory resize
 * might occur with standard `DEBUG_MODE` set.
 *
 * On garbage collect of the javascript object, the associated WASM pointer is checked to see if it has been disposed of.
 */
export class DebugSharedObjectChecks
{
    public static register<T extends object>
    (
        instance: { debugOnAllocate?: () => void } & ISharedObject,
        protectedView: IDebugProtectedView<T>,
        nameOfInstance: string,
    )
        : IDebugProtectedView<T>
    {
        if (instance.debugOnAllocate == null)
        {
            instance.debugOnAllocate = () => protectedView.invalidate();
        }

        RcJsUtilDebug.protectedViews.setValue(instance, protectedView);
        RcJsUtilDebug.sharedObjectLifeCycleChecks.registerFinalizationCheck(instance.sharedObject);
        RcJsUtilDebug.onAllocate.addListener(instance);

        if (!instance.sharedObject.isStatic && _Debug.isFlagSet("DEBUG_VERBOSE_MEMORY_MANAGEMENT"))
        {
            _Debug.verboseLog(`claimed ${nameOfInstance} ${numberGetHexString(instance.sharedObject.getPtr())} - ${stringNormalizeNullUndefinedToEmpty(_Debug.label)}`);
        }

        return protectedView;
    }

    public static unregister
    (
        instance: { debugOnAllocate?: () => void } & ISharedObject,
        nameOfInstance: string,
    )
        : void
    {
        RcJsUtilDebug.sharedObjectLifeCycleChecks.markReadyForFinalize(instance.sharedObject);
        RcJsUtilDebug.protectedViews
            .getValue(instance)
            .invalidate();
        RcJsUtilDebug.protectedViews.deleteValue(instance);
        instance.debugOnAllocate = () => undefined;
        RcJsUtilDebug.onAllocate.removeListener(instance);

        if (!instance.sharedObject.isStatic && _Debug.isFlagSet("DEBUG_VERBOSE_MEMORY_MANAGEMENT"))
        {
            _Debug.verboseLog(`released ${nameOfInstance} ${numberGetHexString(instance.sharedObject.getPtr())} - ${stringNormalizeNullUndefinedToEmpty(_Debug.label)}`);
        }
    }
}