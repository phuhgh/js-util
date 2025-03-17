import { _Debug } from "../../debug/_debug.js";
import { numberGetHexString } from "../../number/impl/number-get-hex-string.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import type { IDebugProtectedViewFactory } from "../../debug/i-debug-protected-view-factory.js";
import type { IManagedObject, IManagedResourceNode, IPointer, PointerDebugMetadata } from "../../lifecycle/manged-resources.js";
import type { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";

/**
 * @internal
 * @remarks
 * `ProtectedViews` will be invalidated any time a memory resize might occur with standard `_BUILD.DEBUG` set.
 *
 * On garbage collect of the javascript object, the associated WASM pointer is checked to see if it has been disposed of.
 */
export class DebugSharedPointerChecks
{
    /**
     * Register the shared object but also registers the associated cleanup on release too.
     */
    public static registerWithCleanup
    (
        wrapper: IEmscriptenWrapper<object>,
        owner: IManagedObject & IPointer,
        metadata: PointerDebugMetadata,
        protectedViewFactory: IDebugProtectedViewFactory | null,
    )
        : void
    {
        const node = owner.resourceHandle;
        owner.resourceHandle.onFreeChannel.addListener({
            onFree: () => DebugSharedPointerChecks.unregister(wrapper, node, metadata, protectedViewFactory)
        });
        DebugSharedPointerChecks.register(wrapper, owner, metadata, protectedViewFactory);
    }

    public static register
    (
        wrapper: IEmscriptenWrapper<object>,
        instance: IManagedObject & IPointer,
        metadata: PointerDebugMetadata,
        protectedViewFactory: IDebugProtectedViewFactory | null,
    )
        : void
    {
        _Debug.assert(instance.pointer != nullPtr, "tried to track nullptr");

        if (protectedViewFactory != null)
        {
            const debugUtils = wrapper.debugUtils;
            debugUtils.protectedViews.setValue(instance.resourceHandle, protectedViewFactory);
            debugUtils.onAllocate.addListener(protectedViewFactory);
        }

        if (metadata.isOwning)
        {
            // stringifying the stack would be far too verbose, most debuggers allow expansion of objects...
            const allocationStack = { stack: _Debug.getStackTrace() };
            const pointer = instance.pointer;
            const address = numberGetHexString(pointer);
            const message = `JS claimed ${metadata.instanceName} ${address}`;
            _Debug.verboseLog(["WASM", "MEMORY", "ALLOCATIONS"], message, allocationStack);

            _Debug.assert(pointer !== nullPtr && pointer != null, "expected pointer to object but got null pointer");
            _Debug.assert(!wrapper.debugUtils.uniquePointers.has(pointer), `expected pointer to be unique (${address})`);
            wrapper.debugUtils.uniquePointers.add(pointer);
        }
        else
        {
            const pointer = instance.pointer;
            const address = numberGetHexString(pointer);
            const message = `JS points to (NON-OWNING) ${metadata.instanceName} ${address}`;
            _Debug.verboseLog(["WASM", "MEMORY"], message);
        }
    }

    public static unregister
    (
        wrapper: IEmscriptenWrapper<object>,
        handle: IManagedResourceNode,
        metadata: PointerDebugMetadata,
        protectedViewFactory: IDebugProtectedViewFactory | null,
    )
        : void
    {
        _Debug.assert(metadata.address != nullPtr, "tried to deallocate null");

        if (protectedViewFactory)
        {
            const debug = wrapper.debugUtils;
            debug.protectedViews
                .getValue(handle)
                .invalidate();
            debug.protectedViews.deleteValue(handle);
            debug.onAllocate.removeListener(protectedViewFactory);
        }

        if (metadata.isOwning)
        {
            const pointer = metadata.address;
            const address = numberGetHexString(pointer);
            _Debug.verboseLog(["WASM", "MEMORY", "DEALLOCATIONS"], `JS released ${metadata.instanceName} ${address}`);

            _Debug.assert(wrapper.debugUtils.uniquePointers.has(pointer), `expected to find pointer (${address})`);
            wrapper.debugUtils.uniquePointers.delete(pointer);
        }
        else
        {
            const pointer = metadata.address;
            const address = numberGetHexString(pointer);
            const message = `JS stops pointing to (NON-OWNING) ${metadata.instanceName} ${address}`;
            _Debug.verboseLog(["WASM", "MEMORY"], message);
        }
    }
}