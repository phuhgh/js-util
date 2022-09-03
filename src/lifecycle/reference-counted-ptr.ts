import { AReferenceCounted, IReferenceCounted } from "./a-reference-counted.js";
import { _Debug } from "../debug/_debug.js";
import { nullPointer } from "../web-assembly/emscripten/null-pointer.js";
import { _Array } from "../array/_array.js";
import { IOnFree } from "./i-on-free.js";
import { ITemporaryListener, TemporaryListener } from "./temporary-listener.js";
import { IEmscriptenWrapper } from "../web-assembly/emscripten/i-emscripten-wrapper.js";

/**
 * @public
 * Wrapper of wasm object.
 * NB The object is pre-claimed (ref count 1) on creation. On free the pointer will be set to null.
 */
export interface IReferenceCountedPtr extends IReferenceCounted
{
    isStatic: boolean;
    getPtr(): number;

    /**
     * Claims the `referenceCountedObject` and releases when this object is released.
     */
    bindLifecycle(referenceCountedObject: IReferenceCountedPtr): void;
    /**
     * Releases the `referenceCountedObject` when this object is released.
     *
     * @remarks
     * The difference with `bindLifecycle` is that this does not increment the reference count, to be used where
     * the object is being passed off as opposed to shared.
     */
    takeOwnership(referenceCountedObject: IReferenceCountedPtr): void;
    /**
     * Releases claim on the `referenceCountedObject`.
     */
    unbindLifecycle(referenceCountedObject: IReferenceCountedPtr): void;
    /**
     * Releases claims on the `referenceCountedObjects`.
     */
    unbindLifecycles(referenceCountedObjects: IReferenceCountedPtr[]): void;

    /**
     * Callback will be called when the reference count hits 0. Useful for cleanup.
     */
    registerOnFreeListener(callback: () => void): void;
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

        if (this.onFreeListener != null)
        {
            this.onFreeListener.clearingEmit();
        }

        if (this.listenerObj != null)
        {
            this.listenerObj.onFree();
        }

        const wrappedReferences = this.wrappedReferences;

        if (wrappedReferences != null)
        {
            for (let i = 0, iEnd = wrappedReferences.length; i < iEnd; ++i)
            {
                wrappedReferences[i].release();
            }

            this.wrappedReferences = null;
        }

        this.wasmPtr = ReferenceCountedPtr.nullPtr;
    }

    public bindLifecycle(referenceCountedObject: IReferenceCountedPtr): void
    {
        this.takeOwnership(referenceCountedObject);
        referenceCountedObject.claim();
    }

    public takeOwnership(referenceCountedObject: IReferenceCountedPtr): void
    {
        const wrappedReferences = this.wrappedReferences = this.wrappedReferences ?? [];
        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            _Debug.assert(!this.getIsDestroyed(), "attempted linkage to dead pointer");
            _Debug.assert(!getHasCycle(this, referenceCountedObject as ReferenceCountedPtr), "detected cycle between pointers");
            _Debug.assert(wrappedReferences.indexOf(referenceCountedObject as ReferenceCountedPtr) === -1, "attempted to add reference twice");
        });
        wrappedReferences.push(referenceCountedObject as ReferenceCountedPtr);
    }

    public unbindLifecycle(referenceCountedObject: IReferenceCountedPtr): void
    {
        if (this.wrappedReferences != null)
        {
            const wasPresent = _Array.removeOne(this.wrappedReferences, referenceCountedObject);

            if (wasPresent)
            {
                referenceCountedObject.release();
            }
        }
    }

    public unbindLifecycles(referenceCountedObjects: IReferenceCountedPtr[]): void
    {
        if (this.wrappedReferences != null)
        {
            const setOfItemsToRemove = new Set(referenceCountedObjects);
            let index = referenceCountedObjects.length;

            while (index-- > 0)
            {
                const referenceCountedObject = referenceCountedObjects[index];

                if (setOfItemsToRemove.has(referenceCountedObject))
                {
                    referenceCountedObjects.splice(index, 1);
                    referenceCountedObject.release();
                }
            }
        }
    }

    public registerOnFreeListener(callback: () => void): void
    {
        this.onFreeListener = this.onFreeListener ?? new TemporaryListener();
        this.onFreeListener.addListener(callback);
    }

    public constructor
    (
        public isStatic: boolean,
        protected wasmPtr: number,
        protected owner: IEmscriptenWrapper<object>,
        public listenerObj?: IOnFree,
    )
    {
        super();
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

    public static getWrappedReferences(ptr: ReferenceCountedPtr): ReferenceCountedPtr[] | null
    {
        return ptr.wrappedReferences;
    }

    private wrappedReferences: ReferenceCountedPtr[] | null = null;
    private onFreeListener: ITemporaryListener<[]> | null = null;
    private static nullPtr = nullPointer;
}

function getHasCycle(referencingTo: ReferenceCountedPtr, referencingFrom: ReferenceCountedPtr): boolean
{
    if (referencingTo.getPtr() === referencingFrom.getPtr())
    {
        return true;
    }

    const refs = ReferenceCountedPtr.getWrappedReferences(referencingFrom);

    if (refs == null)
    {
        return false;
    }

    for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
    {
        if (getHasCycle(referencingTo, refs[i]))
        {
            return true;
        }
    }

    return false;
}