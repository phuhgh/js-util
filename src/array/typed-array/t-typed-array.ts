/**
 * @public
 * Excludes the BigInt versions, as they do not "play well with others"...
 */
export type TTypedArray =
    | Float64Array
    | Float32Array
    | Int32Array
    | Uint32Array
    | Int16Array
    | Uint16Array
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    ;

/**
 * @public
 * All possible typed arrays.
 */
export type TFullSetTypedArray =
    | Float64Array
    | Float32Array
    | BigInt64Array
    | BigUint64Array
    | Int32Array
    | Uint32Array
    | Int16Array
    | Uint16Array
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    ;