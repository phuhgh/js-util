import { _Debug } from "./_debug";
import { DebugPointer } from "./debug-pointer";
import { _Production } from "../production/_production";
import { IDebugSharedObject } from "./i-debug-shared-object";

/**
 * @public
 * Wrapper of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry|FinalizationRegistry} for shared objects,
 * useful for checking if the shared object was properly disposed. Available in debug contexts only.
 */
export interface IDebugSharedObjectLifeCycleChecker
{
    registerFinalizationCheck(sharedObject: IDebugSharedObject): void;
    markReadyForFinalize(sharedObject: IDebugSharedObject): void;
}

/**
 * When a javascript object is garbage collected, check if the corresponding WASM object has been freed.
 */
export class DebugSharedObjectLifeCycleChecker implements IDebugSharedObjectLifeCycleChecker
{
    public registerFinalizationCheck(sharedObject: IDebugSharedObject): void
    {
        const instanceOwningPtr = this.owningPointers.get(sharedObject.getPtr());

        if (instanceOwningPtr != null)
        {
            _Debug.error([
                "Address has already been claimed by:",
                instanceOwningPtr.toString(),
            ].join("\n"));
        }

        const debugPointer = new DebugPointer(sharedObject.getPtr(), sharedObject.constructor, sharedObject.isStatic);
        this.debugPointers.add(debugPointer);
        this.sharedObjToPtr.set(sharedObject, debugPointer);

        if (!sharedObject.isStatic)
        {
            this.owningPointers.set(debugPointer.pointer, debugPointer);
        }

        this.finalizationRegistry.register(sharedObject, debugPointer);
    }

    public markReadyForFinalize(sharedObject: IDebugSharedObject): void
    {
        if (!sharedObject.isStatic)
        {
            this.owningPointers.delete(sharedObject.getPtr());
        }

        const pointer = this.sharedObjToPtr.get(sharedObject);

        if (pointer == null)
        {
            throw _Production.createError("expected to find pointer");
        }

        this.debugPointers.delete(pointer);
    }

    private finalizationRegistry = new FinalizationRegistry((debugPointer: DebugPointer) =>
    {
        if (this.debugPointers.has(debugPointer))
        {
            // must have failed to clean up for the pointer to still be present

            if (debugPointer.isStatic)
            {
                // the wasm memory hasn't been cleaned up
                // the js object may leak in production too (resize listener), but we don't know
                // fixing one fixes the other
                const message = [
                    "Finalization registry found unreleased wasm object allocated by:",
                    debugPointer.toString(),
                ].join("\n");

                _Debug.error(message);
            }
            else
            {
                // wasm memory never gets cleaned up (static)
                // the js object will leak in production (resize listener is a strong reference in that case)
                _Debug.error([
                    "Leaked shared static object on the JS side:",
                    debugPointer.toString(),
                ].join("\n"));
            }
        }
    });

    private owningPointers = new Map<number, DebugPointer>();
    private sharedObjToPtr = new WeakMap<IDebugSharedObject, DebugPointer>();
    private debugPointers = new Set<DebugPointer>();
}