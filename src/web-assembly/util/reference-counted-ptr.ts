import { AReferenceCounted, IReferenceCounted } from "../../lifecycle/a-reference-counted.js";
import { _Debug } from "../../debug/_debug.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { lifecycleStack } from "../emscripten/lifecycle-stack.js";
import { ILinkedReferences } from "../../lifecycle/linked-references.js";

/**
 * @public
 * Wrapper of wasm object.
 * NB The object is pre-claimed (ref count 1) on creation. On free the pointer will be set to null.
 */
export interface IReferenceCountedPtr extends IReferenceCounted
{
    readonly isStatic: boolean;
    getPtr(): number;
}

/**
 * @public
 * Wrapper of wasm void*. This must have been allocated by malloc, otherwise the behavior is undefined.
 */
export class ReferenceCountedPtr<TBindings extends object = object>
    extends AReferenceCounted
    implements IReferenceCountedPtr
{
    public static createOneBound<TBindings extends object = object>
    (
        bindToReference: ILinkedReferences | null,
        isStatic: boolean,
        wasmPtr: number,
        wrapper: IEmscriptenWrapper<TBindings>,
    )
        : IReferenceCountedPtr
    {
        const ptr = new ReferenceCountedPtr(isStatic, wasmPtr, wrapper);
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
        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            this.wrapper.debug.uniquePointers.delete(this.wasmPtr);
        });
        this.wasmPtr = nullPtr;
    }

    public constructor
    (
        public readonly isStatic: boolean,
        protected wasmPtr: number,
        protected readonly wrapper: IEmscriptenWrapper<TBindings>,
    )
    {
        super();
        lifecycleStack.register(this);

        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            _Debug.assert(this.wasmPtr !== nullPtr && this.wasmPtr != null, "expected pointer to object but got null pointer");

            if (!this.isStatic)
            {
                _Debug.assert(!this.wrapper.debug.uniquePointers.has(this.wasmPtr), `expected pointer to be unique (0x${this.wasmPtr.toString(16)})`);
                this.wrapper.debug.uniquePointers.add(this.wasmPtr);
            }
        });
    }
}

