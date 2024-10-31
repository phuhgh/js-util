/**
 * @public
 * Excludes the BigInt versions, as they do not "play well with others"...
 */
export type TTypedArrayCtor =
    | Float64ArrayConstructor
    | Float32ArrayConstructor
    | Int32ArrayConstructor
    | Uint32ArrayConstructor
    | Int16ArrayConstructor
    | Uint16ArrayConstructor
    | Int8ArrayConstructor
    | Uint8ArrayConstructor
    | Uint8ClampedArrayConstructor
    ;

/**
 * @public
 * All possible typed arrays constructors. BigInt variants are not well-supported.
 */
export type TFullSetTypedArrayCtor =
    | Float64ArrayConstructor
    | Float32ArrayConstructor
    | BigInt64ArrayConstructor
    | BigUint64ArrayConstructor
    | Int32ArrayConstructor
    | Uint32ArrayConstructor
    | Int16ArrayConstructor
    | Uint16ArrayConstructor
    | Int8ArrayConstructor
    | Uint8ArrayConstructor
    | Uint8ClampedArrayConstructor
    ;