import { AReferenceCounted, IReferenceCounted } from "./a-reference-counted";
import { _Debug } from "../debug/_debug";
import { nullPointer } from "../web-assembly/emscripten/null-pointer";
import { TListener } from "../eventing/t-listener";
import { _Array } from "../array/_array";

/**
 * @public
 * Holds a reference to wasm object.
 */
export interface ISharedObject
{
    readonly sharedObject: IReferenceCountedPtr;
}

/**
 * @public
 * Wrapper of wasm object.
 * NB The object is pre-claimed (ref count 1) on creation.
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
     * Releases claim to the the `referenceCountedObject`.
     */
    unbindLifecycle(referenceCountedObject: IReferenceCountedPtr): void;
    /**
     * Releases claims on the the `referenceCountedObjects`.
     */
    unbindLifecycles(referenceCountedObjects: IReferenceCountedPtr[]): void;
}

/**
 * @public
 */
export interface IOnRelease
{
    onRelease(): void
}

/**
 * @public
 */
export interface IOnMemoryResize extends TListener<"onMemoryResize", []>
{
}

/**
 * @public
 * Wrapper of wasm object.
 */
export class ReferenceCountedPtr extends AReferenceCounted implements IReferenceCountedPtr, IOnRelease
{
    public getPtr(): number
    {
        return this.wasmPtr;
    }

    public onRelease(): void
    {
        this.listener.onRelease();

        const wrappedReferences = this.wrappedReferences;

        if (wrappedReferences != null)
        {
            for (let i = 0, iEnd = wrappedReferences.length; i < iEnd; ++i)
            {
                wrappedReferences[i].release();
            }

            this.wrappedReferences = null;
        }
    }

    public bindLifecycle(referenceCountedObject: IReferenceCountedPtr): void
    {
        this.takeOwnership(referenceCountedObject);
        referenceCountedObject.claim();
    }

    public takeOwnership(referenceCountedObject: IReferenceCountedPtr): void
    {
        const wrappedReferences = this.wrappedReferences = this.wrappedReferences ?? [];
        DEBUG_MODE && _Debug.runBlock(() =>
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

    public constructor
    (
        public isStatic: boolean,
        protected wasmPtr: number,
        public listener: { onRelease(): void },
    )
    {
        super();
        DEBUG_MODE && _Debug.assert(this.wasmPtr !== nullPointer && this.wasmPtr != null, "expected pointer to object but got null pointer");
    }

    public wrappedReferences: ReferenceCountedPtr[] | null = null;
}

function getHasCycle(referencingTo: ReferenceCountedPtr, referencingFrom: ReferenceCountedPtr): boolean
{
    if (referencingTo.getPtr() === referencingFrom.getPtr())
    {
        return true;
    }

    if (referencingFrom.wrappedReferences == null)
    {
        return false;
    }

    for (let i = 0, iEnd = referencingFrom.wrappedReferences.length; i < iEnd; ++i)
    {
        if (getHasCycle(referencingTo, referencingFrom.wrappedReferences[i]))
        {
            return true;
        }
    }

    return false;
}