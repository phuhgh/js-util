import { type IManagedObject, type IOnFreeListener, type IPointer, PointerDebugMetadata } from "../../lifecycle/manged-resources.js";
import type { IDebugProtectedViewFactory } from "../../debug/i-debug-protected-view-factory.js";
import type { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import type { IInteropBindings } from "../emscripten/i-interop-bindings.js";
import { _Production } from "../../production/_production.js";

/**
 * @public
 * Defines the cleanup behavior of {@link SharedObjectCleanup}
 */
export enum ESharedObjectOwnerKind
{
    NotOwning = 1,
    SharedMemoryOwner,
    Freeable,
}

/**
 * @public
 *
 * Provides reasonable defaults for cleaning up a handle to a `JsInterop::ASharedMemoryObject`.
 */
export class SharedObjectCleanup implements IOnFreeListener
{
    public static Options = class SharedObjectCleanupOptions
    {
        public constructor
        (
            public readonly debugName: string,
            public readonly protectedView: IDebugProtectedViewFactory | null,
            public readonly ownershipKind: ESharedObjectOwnerKind,
        )
        {
        }
    };

    public readonly wrapper: IEmscriptenWrapper<IInteropBindings>;
    public readonly ptr: number;

    public static createWithCleanup
    (
        sharedObject: IManagedObject & IPointer,
        options: InstanceType<typeof SharedObjectCleanup.Options>
    )
        : SharedObjectCleanup
    {
        const cleanup = new SharedObjectCleanup(sharedObject, options.ownershipKind);
        SharedObjectCleanup.registerCleanup(sharedObject, cleanup, options);
        return cleanup;
    }

    public static registerCleanup
    (
        sharedObject: IManagedObject & IPointer,
        cleanup: SharedObjectCleanup,
        options: InstanceType<typeof SharedObjectCleanup.Options>
    )
        : void
    {
        // regardless of owning, there might still be cleanup required
        sharedObject.resourceHandle.onFreeChannel.addListener(cleanup);
        sharedObject.getWrapper()
            .lifecycleStrategy
            .onSharedPointerCreated(
                sharedObject,
                new PointerDebugMetadata(sharedObject.pointer, options.ownershipKind != ESharedObjectOwnerKind.NotOwning, options.debugName),
                options.protectedView
            );
    }

    public constructor
    (
        sharedObject: IManagedObject & IPointer,
        protected readonly ownershipKind: ESharedObjectOwnerKind,
    )
    {
        this.wrapper = sharedObject.getWrapper();
        this.ptr = sharedObject.pointer;
    }

    public onFree(): void
    {
        switch (this.ownershipKind)
        {
            case ESharedObjectOwnerKind.SharedMemoryOwner:
                this.wrapper.instance._jsUtilDeleteObject(this.ptr);
                break;
            case ESharedObjectOwnerKind.Freeable:
                this.wrapper.instance._jsUtilFree(this.ptr);
                break;
            case ESharedObjectOwnerKind.NotOwning:
                // we don't need to do anything...
                break;
            default:
                _Production.assertValueIsNever(this.ownershipKind);

        }
    }
}