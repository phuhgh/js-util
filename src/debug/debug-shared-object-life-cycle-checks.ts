import { _Debug } from "./_debug";
import { DebugPointer } from "./debug-pointer";
import { _Production } from "../production/_production";
import { IDebugSharedObject, IDebugSharedObjectLifeCycleChecks } from "rc-js-util-globals";

export class DebugSharedObjectLifeCycleChecks implements IDebugSharedObjectLifeCycleChecks
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

        const debugPointer = new DebugPointer(sharedObject.getPtr(), sharedObject.constructor);

        if (sharedObject.isStatic)
        {
            this.staticPointers.add(debugPointer);
            this.sharedObjToPtr.set(sharedObject, debugPointer);
        }
        else
        {
            this.owningPointers.set(debugPointer.pointer, debugPointer);
        }

        this.finalizationRegistry.register(sharedObject, debugPointer);
    }

    public markReadyForFinalize(sharedObject: IDebugSharedObject): void
    {
        if (sharedObject.isStatic)
        {
            const pointer = this.sharedObjToPtr.get(sharedObject);

            if (pointer == null)
            {
                _Production.error("expected to find pointer");
            }

            this.staticPointers.delete(pointer);
        }
        else
        {
            this.owningPointers.delete(sharedObject.getPtr());
        }
    }

    private finalizationRegistry = new FinalizationRegistry((owner: DebugPointer) =>
    {
        if (this.owningPointers.has(owner.pointer))
        {
            // the wasm memory hasn't been cleaned up
            // the js object may leak in production too (resize listener), but we don't know
            // fixing one fixes the other
            const message = [
                "Leaked shared instance object:",
                owner.toString(),
            ].join("\n");

            // finalizers can be quite janky...
            if (_Debug.isFlagSet("DEBUG_PEDANTIC"))
            {
                _Debug.error(message);
            }
            else
            {
                _Debug.verboseLog(message);
            }
        }

        if (this.staticPointers.has(owner))
        {
            // wasm memory never gets cleaned up (static)
            // the js object will leak in production (resize listener is a strong reference in that case)
            _Debug.error([
                "Leaked shared static object:",
                owner.toString(),
            ].join("\n"));
        }
    });

    private owningPointers = new Map<number, DebugPointer>();
    private staticPointers = new Set<DebugPointer>();
    private sharedObjToPtr = new WeakMap<IDebugSharedObject, DebugPointer>();
}