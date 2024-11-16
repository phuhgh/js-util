import { type TFullSetTypedArrayCtor } from "../array/typed-array/t-typed-array-ctor.js";
import type { IJsUtilBindings } from "../web-assembly/i-js-util-bindings.js";
import { type IEmscriptenWrapper } from "../web-assembly/emscripten/i-emscripten-wrapper.js";
import type { IManagedObject, IPointer } from "../lifecycle/manged-resources.js";
import { type ISharedBufferView, SharedBufferView } from "../web-assembly/shared-memory/shared-buffer-view.js";
import { _Debug } from "../debug/_debug.js";

/**
 * @public
 * Matches ENumberIdentifier in `RTTI.hpp`.
 */
export enum ENumberIdentifier
{
    U8 = 0, // used for indexing
    U16,
    U32,
    U64, // this is not generally supported...
    I8,
    I16,
    I32,
    I64, // this is not generally supported...
    F32,
    F64,
}

/**
 * @public
 * Given a typed array constructor, get the identifier which matches up with ENumberIdentifier in `RTTI.hpp`.
 */
export function getNumberIdentifier(ctor: TFullSetTypedArrayCtor): ENumberIdentifier
{
    return numberIdentifierMapping.get(ctor)!;
}

const numberIdentifierMapping = new Map<TFullSetTypedArrayCtor, ENumberIdentifier>([
    [Uint8Array as TFullSetTypedArrayCtor, ENumberIdentifier.U8],
    [Uint16Array as TFullSetTypedArrayCtor, ENumberIdentifier.U16],
    [Uint32Array as TFullSetTypedArrayCtor, ENumberIdentifier.U32],
    [BigUint64Array as TFullSetTypedArrayCtor, ENumberIdentifier.U64],
    [Int8Array as TFullSetTypedArrayCtor, ENumberIdentifier.I8],
    [Int16Array as TFullSetTypedArrayCtor, ENumberIdentifier.I16],
    [Int32Array as TFullSetTypedArrayCtor, ENumberIdentifier.I32],
    [BigInt64Array as TFullSetTypedArrayCtor, ENumberIdentifier.I64],
    [Float32Array as TFullSetTypedArrayCtor, ENumberIdentifier.F32],
    [Float64Array as TFullSetTypedArrayCtor, ENumberIdentifier.F64],
]);

/**
 * @public
 * Mirrors the C++ class of the same name. This can be used as a key to get a unique number which can be matched on the C++ side.
 */
export class StableId
{
    public constructor
    (
        public readonly name: string,
    )
    {
    }
}

/**
 * @public
 * Mirrors the C++ class of the same name. Each category can have multiple kinds of specializations.
 *
 * @remarks There should only be one instance of a conceptual class (which should have a unique name)
 */
export class IdCategory extends StableId
{
}

/**
 * @public
 * Mirrors the C++ class of the same name. A specialization of a conceptual category. E.g. a number (category) which is a float 32 (specialization).
 *
 * @remarks There should only be one instance of a conceptual class (which should have a unique name)
 */
export class IdSpecialization extends StableId
{
    public constructor
    (
        public readonly category: IdCategory,
        specializationName: string,
    )
    {
        super(specializationName);
    }
}

/**
 * @public
 * Supported types of number across C++ and JavaScript.
 */
export const numberCategory = new IdCategory("JSU_NUMBER");


/**
 * @public
 * A buffer that can be shared with C++.
 */
export const bufferCategory = new IdCategory("JSU_BUFFER");

/**
 * @public
 * Given a Typed array constructor, get back the associated {@link StableId}.
 */
export function getNumberSpecialization(ctor: TFullSetTypedArrayCtor): IdSpecialization
{
    return numberSpecializationMapping.get(ctor)!;
}

/**
 * @public
 * {@link IdSpecialization} for all supported number types.
 */
export const numberSpecializations = new class NumberSpecializations
{
    public readonly u8 = new IdSpecialization(numberCategory, "JSU_U8");
    public readonly u16 = new IdSpecialization(numberCategory, "JSU_U16");
    public readonly u32 = new IdSpecialization(numberCategory, "JSU_U32");
    public readonly u64 = new IdSpecialization(numberCategory, "JSU_U64");
    public readonly i8 = new IdSpecialization(numberCategory, "JSU_I8");
    public readonly i16 = new IdSpecialization(numberCategory, "JSU_I16");
    public readonly i32 = new IdSpecialization(numberCategory, "JSU_I32");
    public readonly i64 = new IdSpecialization(numberCategory, "JSU_I64");
    public readonly f32 = new IdSpecialization(numberCategory, "JSU_F32");
    public readonly f64 = new IdSpecialization(numberCategory, "JSU_F64");
}();

const numberSpecializationMapping = new Map<TFullSetTypedArrayCtor, IdSpecialization>([
    [Uint8Array as TFullSetTypedArrayCtor, numberSpecializations.u8],
    [Uint16Array as TFullSetTypedArrayCtor, numberSpecializations.u16],
    [Uint32Array as TFullSetTypedArrayCtor, numberSpecializations.u32],
    [BigUint64Array as TFullSetTypedArrayCtor, numberSpecializations.u64],
    [Int8Array as TFullSetTypedArrayCtor, numberSpecializations.i8],
    [Int16Array as TFullSetTypedArrayCtor, numberSpecializations.i16],
    [Int32Array as TFullSetTypedArrayCtor, numberSpecializations.i32],
    [BigInt64Array as TFullSetTypedArrayCtor, numberSpecializations.i64],
    [Float32Array as TFullSetTypedArrayCtor, numberSpecializations.f32],
    [Float64Array as TFullSetTypedArrayCtor, numberSpecializations.f64],
]);

/**
 * @internal
 */
export interface ITypedArrayConstructors
{
    f64: Function;
    f32: Function;
    i64: Function | null; // indicates not supported
    u64: Function | null; // indicates not supported
    u32: Function;
    i32: Function;
    u16: Function;
    i16: Function;
    u8c: Function;
    u8: Function;
    i8: Function;
}

/**
 * @internal
 */
export function populateTypedArrayConstructorMap(constructors: ITypedArrayConstructors): Map<TFullSetTypedArrayCtor, Function>
{
    const m = new Map<TFullSetTypedArrayCtor, Function>();
    m.set(Float64Array, constructors.f64);
    m.set(Float32Array, constructors.f32);
    if (constructors.i64 != null)
    {
        m.set(BigInt64Array, constructors.i64);
    }
    if (constructors.u64 != null)
    {
        m.set(BigUint64Array, constructors.u64);
    }
    m.set(Int32Array, constructors.i32);
    m.set(Uint32Array, constructors.u32);
    m.set(Int16Array, constructors.i16);
    m.set(Uint16Array, constructors.u16);
    m.set(Int8Array, constructors.i8);
    m.set(Uint8Array, constructors.u8);
    m.set(Uint8ClampedArray, constructors.u8c);

    return m;
}

/**
 * @public
 * Provides the number which matches up with the C++ end, given a {@link StableId}.
 */
export interface IStableStore
{
    initialize(): void;
    getId(key: IdSpecialization | IdCategory): number;
    setSpecializations(sharedObjectHandle: IManagedObject & IPointer, specializations: readonly IdSpecialization[]): void;
    hasId(sharedObjectHandle: IManagedObject & IPointer, specialization: IdSpecialization): boolean;
}

/**
 * @public
 * {@inheritDoc IStableStore}
 */
export class StableIdStore implements IStableStore
{
    public constructor
    (
        private readonly wrapper: IEmscriptenWrapper<IJsUtilBindings>,
    )
    {
    }

    public initialize(): void
    {
        this.idBuffer = new SharedBufferView(
            this.wrapper,
            this.wrapper.rootNode,
            Uint16Array,
            this.wrapper.instance._jsUtilGetRuntimeMappingAddress(),
            32 * Uint16Array.BYTES_PER_ELEMENT
        );
    }

    public getId(key: IdSpecialization | IdCategory): number
    {
        let id = this.ids.get(key);

        if (id == null)
        {
            const namePtr = this.wrapper.instance.stringToNewUTF8(key.name);
            id = this.wrapper.instance._jsUtilGetRuntimeMappingId(namePtr);
            this.ids.set(key, id);
            this.wrapper.instance._jsUtilFree(namePtr);
        }

        return id;
    }

    public setSpecializations(sharedObjectHandle: IManagedObject & IPointer, specializations: readonly IdSpecialization[]): void
    {
        _BUILD.DEBUG && _Debug.assert(this.idBuffer != null, "attempted to set ids before initialization happened...");
        _BUILD.DEBUG && _Debug.assert(specializations.length < 32, "a maximum of 30 specializations can be added at one time");
        const idBuffer = this.idBuffer!.getArray(); // [[category, specialization],  ...]

        for (let i = 0, iEnd = specializations.length; i < iEnd; i++)
        {
            const specialization = specializations[i];
            idBuffer[i * 2] = this.getId(specialization);
            idBuffer[i * 2 + 1] = this.getId(specialization.category);
        }

        this.wrapper.instance._jsUtilAddRuntimeMappings(specializations.length, sharedObjectHandle.pointer);
    }

    public hasId(sharedObjectHandle: IManagedObject & IPointer, specialization: IdSpecialization): boolean
    {
        return Boolean(this.wrapper.instance._jsUtilHasRuntimeMappingId(
            sharedObjectHandle.pointer,
            this.getId(specialization.category),
            this.getId(specialization)
        ));
    }

    private ids: Map<IdSpecialization | IdCategory, number> = new Map();
    private idBuffer: ISharedBufferView<Uint16ArrayConstructor> | null = null;
}