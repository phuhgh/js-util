import { IReferenceCountedPtr, ISharedObject, ReferenceCountedPtr } from "../lifecycle/reference-counted-ptr";
import { IEmscriptenWrapper } from "./emscripten/i-emscripten-wrapper";
import { Emscripten } from "../../external/emscripten";
import { nullPointer } from "./emscripten/null-pointer";
import { _Production } from "../production/_production";

/**
 * @public
 * Provides a reference counted wrapper to a pointer `malloc`'d from JS and is `free`'d on reference count hitting 0.
 */
export interface IRawVoidPointer extends ISharedObject
{
    pointer: number;
    byteSize: number;
}

/**
 * @public
 */
export class RawVoidPointer implements IRawVoidPointer
{
    public readonly sharedObject: IReferenceCountedPtr;
    public readonly pointer: number;
    public readonly byteSize: number;

    public static createOne(wrapper: IEmscriptenWrapper, byteSize: number): RawVoidPointer
    public static createOne(wrapper: IEmscriptenWrapper, byteSize: number, allocationFailThrows: boolean): RawVoidPointer;
    public static createOne
    (
        wrapper: IEmscriptenWrapper,
        byteSize: number,
        allocationFailThrows?: boolean,
    )
        : RawVoidPointer
    {
        DEBUG_MODE && RcJsUtilDebug.onAllocate.emit();
        const pointer = (wrapper.instance as Emscripten.EmscriptenModule)._malloc(byteSize);

        if (pointer == nullPointer)
        {
            if (allocationFailThrows ?? false)
            {
                throw _Production.error("Failed to allocate memory for raw pointer.");
            }
        }

        return new RawVoidPointer(wrapper, pointer, byteSize);
    }

    public onRelease(): void
    {
        (this.wrapper.instance as Emscripten.EmscriptenModule)._free(this.pointer);
        (this.pointer as number) = nullPointer;
    }

    protected constructor
    (
        private readonly wrapper: IEmscriptenWrapper,
        pointer: number,
        byteSize: number,
    )
    {
        this.pointer = pointer;
        this.byteSize = byteSize;
        this.sharedObject = new ReferenceCountedPtr(false, pointer, this);
    }
}