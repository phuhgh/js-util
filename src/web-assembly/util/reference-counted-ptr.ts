import { AReferenceCounted, IReferenceCounted } from "../../lifecycle/a-reference-counted.js";
import { _Debug } from "../../debug/_debug.js";
import { nullPointer } from "../emscripten/null-pointer.js";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { lifecycleStack } from "../emscripten/lifecycle-stack.js";

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
 * Wrapper of wasm object.
 */
export class ReferenceCountedPtr extends AReferenceCounted implements IReferenceCountedPtr
{
    public getPtr(): number
    {
        return this.wasmPtr;
    }

    /**
     * DO NOT CALL THIS DIRECTLY, CALL RELEASE.
     */
    protected onFree(): void
    {
        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            this.owner.debug.uniquePointers.delete(this.wasmPtr);
        });

        super.onFree();
        this.wasmPtr = nullPointer;
    }

    public constructor
    (
        public readonly isStatic: boolean,
        protected wasmPtr: number,
        protected readonly owner: IEmscriptenWrapper<object>,
    )
    {
        super();
        lifecycleStack.register(this);

        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            _Debug.assert(this.wasmPtr !== nullPointer && this.wasmPtr != null, "expected pointer to object but got null pointer");

            if (!this.isStatic)
            {
                _Debug.assert(!this.owner.debug.uniquePointers.has(this.wasmPtr), "expected pointer to be unique");
                this.owner.debug.uniquePointers.add(this.wasmPtr);
            }
        });
    }
}
