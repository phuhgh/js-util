import { AReferenceCounted } from "../../lifecycle/a-reference-counted.js";
import { ILinkedReferences } from "../../lifecycle/linked-references.js";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import { _Debug } from "../../debug/_debug.js";
import type { IMemoryUtilBindings } from "../emscripten/i-memory-util-bindings.js";
import { lifecycleStack } from "../emscripten/lifecycle-stack.js";
import type { IReferenceCountedPtr } from "./reference-counted-ptr.js";

/**
 * @public
 * Wrapper of wasm ISharedMemoryObject*. Must be an owning pointer to an extension of ISharedMemoryObject, otherwise the
 * behavior is undefined.
 */
export class ReferenceCountedSharedObject<TBindings extends IMemoryUtilBindings = IMemoryUtilBindings>
    extends AReferenceCounted
    implements IReferenceCountedPtr
{
    public readonly wrapper: IEmscriptenWrapper<TBindings>;
    public readonly isStatic: boolean = false;

    public static createOneBound<TBindings extends IMemoryUtilBindings = IMemoryUtilBindings>
    (
        bindToReference: ILinkedReferences | null,
        wasmPtr: number,
        wrapper: IEmscriptenWrapper<TBindings>,
    )
        : ReferenceCountedSharedObject<TBindings>
    {
        const ptr = new ReferenceCountedSharedObject(wasmPtr, wrapper);
        bindToReference?.linkRef(ptr);
        return ptr;
    }

    public getPtr(): number
    {
        return this.wasmPtr;
    }

    /**
     * DO NOT CALL THIS DIRECTLY, CALL RELEASE.
     */
    protected onFree(): void
    {
        super.onFree();
        this.wrapper.instance._jsUtilDeleteObject(this.wasmPtr);
        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            this.wrapper.debug.uniquePointers.delete(this.wasmPtr);
        });
        this.wasmPtr = nullPtr;
    }

    public constructor
    (
        protected wasmPtr: number,
        wrapper: IEmscriptenWrapper<TBindings>,
    )
    {
        super();
        this.wrapper = wrapper;
        lifecycleStack.register(this);
        _BUILD.DEBUG && _Debug.assert(
        this.wasmPtr !== nullPtr && this.wasmPtr != null,
            "expected pointer to ISharedMemoryObject but got null pointer",
        );
    }
}