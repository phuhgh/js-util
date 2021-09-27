import { TTupleLike } from "../../typescript/t-tuple-like";
import { TTupleLikeOfLength } from "../../typescript/t-tuple-like-of-length";
import { TTypedArray } from "./t-typed-array";
import { TNeverFallback } from "../../typescript/t-never-fallback";

/**
 * @public
 * The method names of {@link ATypedArrayTuple} which mutate the array.
 */
export type TTypedArrayTupleMutativeMethods =
    | "fill"
    | "copyWithin"
    | "reverse"
    | "set"
    | "sort"
    | "subarray"
    ;

/**
 * @public
 * Extract numerical indexes out of a type, if there aren't any fallback to number.
 */
export type TExtractIndexes<T> = TNeverFallback<Extract<keyof T, number>, number>;

/**
 * @public
 * Like ATypedArrayTuple but indexable with any number.
 */
export type TDecayedTypedArrayTuple = TTupleLike<number, number, number> & ATypedArrayTuple<number, TTypedArray>

/**
 * @public
 * Common methods of typed arrays, extend to make typed array tuples.
 */
export class ATypedArrayTuple<TLength extends number, TArray extends TTypedArray>
{
    /**
     * The size in bytes of each element in the array.
     */
    public readonly BYTES_PER_ELEMENT!: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    public readonly buffer!: ArrayBufferLike;

    /**
     * The length in bytes of the array.
     */
    public readonly byteLength!: number;

    /**
     * The offset in bytes of the array.
     */
    public readonly byteOffset!: number;
    /**
     * The length of the array.
     */
    public readonly length!: TLength;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param _target - If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param _start - If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param _end - If not specified, length of the this object is used as its default value.
     */
    public copyWithin(_target: number, _start: number, _end?: number): this
    {
        throw new Error();
    }

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param _callbackfn - A function that accepts up to three arguments. The every method calls
     * the _callbackfn function for each element in array1 until the _callbackfn returns false,
     * or until the end of the array.
     * @param _thisArg - An object to which the this keyword can refer in the _callbackfn function.
     * If _thisArg is omitted, undefined is used as the this value.
     */
    public every(_callbackfn: (value: number, index: TExtractIndexes<this>, array: this) => boolean, _thisArg?: unknown): boolean
    {
        throw new Error();
    }

    /**
     * Returns the this object after filling the section identified by start and end with value
     * @param _value - value to fill array section with
     * @param _start - index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param _end - index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    public fill(_value: number, _start?: number, _end?: number): this
    {
        throw new Error();
    }

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param _callbackfn - A function that accepts up to three arguments. The filter method calls
     * the _callbackfn function one time for each element in the array.
     * @param _thisArg - An object to which the this keyword can refer in the _callbackfn function.
     * If _thisArg is omitted, undefined is used as the this value.
     */
    public filter(_callbackfn: (value: number, index: TExtractIndexes<this>, array: this) => unknown, _thisArg?: unknown): TDecayedTypedArrayTuple
    {
        throw new Error();
    }

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param _predicate - find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param _thisArg - If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    public find(_predicate: (value: number, index: TExtractIndexes<this>, obj: this) => boolean, _thisArg?: unknown): number | undefined
    {
        throw new Error();
    }

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param _predicate - find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param _thisArg - If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    public findIndex(_predicate: (value: number, index: TExtractIndexes<this>, obj: this) => boolean, _thisArg?: unknown): number
    {
        throw new Error();
    }

    /**
     * Performs the specified action for each element in an array.
     * @param _callbackfn -  A function that accepts up to three arguments. forEach calls the
     * _callbackfn function one time for each element in the array.
     * @param _thisArg -  An object to which the this keyword can refer in the _callbackfn function.
     * If _thisArg is omitted, undefined is used as the this value.
     */
    public forEach(_callbackfn: (value: number, index: number, array: this) => void, _thisArg?: unknown): void
    {
        throw new Error();
    }

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param _searchElement - The value to locate in the array.
     * @param _fromIndex - The array index at which to begin the search. If fromIndex is omitted, the
     *  search starts at index 0.
     */
    public indexOf(_searchElement: number, _fromIndex?: number): number
    {
        throw new Error();
    }

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param _separator - A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    public join(_separator?: string): string
    {
        throw new Error();
    }

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param _searchElement - The value to locate in the array.
     * @param _fromIndex - The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    public lastIndexOf(_searchElement: number, _fromIndex?: number): number
    {
        throw new Error();
    }

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param _callbackfn - A function that accepts up to three arguments. The map method calls the
     * _callbackfn function one time for each element in the array.
     * @param _thisArg - An object to which the this keyword can refer in the _callbackfn function.
     * If _thisArg is omitted, undefined is used as the this value.
     */
    public map(_callbackfn: (value: number, index: TExtractIndexes<this>, array: this) => number, _thisArg?: unknown): this
    {
        throw new Error();
    }

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param _callbackfn - A function that accepts up to four arguments. The reduce method calls the
     * _callbackfn function one time for each element in the array.
     * @param initialValue - If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the _callbackfn function provides this value as an argument
     * instead of an array value.
     */
    public reduce<U>(_callbackfn: (previousValue: U, currentValue: number, currentIndex: TExtractIndexes<this>, array: this) => U, initialValue: U): U;
    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param _callbackfn - A function that accepts up to four arguments. The reduce method calls the
     * _callbackfn function one time for each element in the array.
     * @param initialValue - If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the _callbackfn function provides this value as an argument
     * instead of an array value.
     */
    public reduce(_callbackfn: (previousValue: number, currentValue: number, currentIndex: TExtractIndexes<this>, array: this) => number, initialValue?: number): number
    public reduce(__callbackfn: (previousValue: number, currentValue: number, currentIndex: TExtractIndexes<this>, array: this) => number, _initialValue?: number): number
    {
        throw new Error();
    }

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param _callbackfn - A function that accepts up to four arguments. The reduceRight method calls
     * the _callbackfn function one time for each element in the array.
     * @param initialValue - If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the _callbackfn function provides this value as an argument
     * instead of an array value.
     */
    public reduceRight<U>(_callbackfn: (previousValue: U, currentValue: number, currentIndex: TExtractIndexes<this>, array: this) => U, initialValue: U): U
    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param _callbackfn - A function that accepts up to four arguments. The reduceRight method calls
     * the _callbackfn function one time for each element in the array.
     * @param initialValue - If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the _callbackfn function provides this value as an
     * argument instead of an array value.
     */
    public reduceRight(_callbackfn: (previousValue: number, currentValue: number, currentIndex: TExtractIndexes<this>, array: this) => number, initialValue?: number): number
    public reduceRight(__callbackfn: (previousValue: number, currentValue: number, currentIndex: TExtractIndexes<this>, array: this) => number, _initialValue?: number): number
    {
        throw new Error();
    }

    /**
     * Reverses the elements in an Array.
     */
    public reverse(): this
    {
        throw Error();
    }

    /**
     * Sets a value or an array of values.
     * @param _array - A typed or untyped array of values to set.
     * @param _offset - The index in the current array at which the values are to be written.
     */
    public set(_array: ArrayLike<number>, _offset: number): void;
    /**
     * Sets a value or an array of values. Where an offset is not provided the array must be a tuple of the same length.
     * To perform a partial write from the start of the array, set an offset of 0.
     * @param _array - A tuple of size equal to that which is being set.
     */
    public set(_array: TTupleLikeOfLength<number, TLength>): void
    public set(_array: ArrayLike<number>, _offset?: number): void
    {
        throw new Error();
    }


    public slice(): this
    public slice(_start?: number, _end?: number): TDecayedTypedArrayTuple
    public slice(_start?: number, _end?: number): never
    {
        throw new Error();
    }

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param _callbackfn - A function that accepts up to three arguments. The some method calls the
     * _callbackfn function for each element in array1 until the _callbackfn returns true, or until
     * the end of the array.
     * @param _thisArg - An object to which the this keyword can refer in the _callbackfn function.
     * If _thisArg is omitted, undefined is used as the this value.
     */
    public some(_callbackfn: (value: number, index: TExtractIndexes<this>, array: this) => boolean, _thisArg?: unknown): boolean
    {
        throw new Error();
    }

    /**
     * Sorts an array.
     * @param _compareFn - The name of the function used to determine the order of the elements. If
     * omitted, the elements are sorted in ascending, ASCII character order.
     */
    public sort(_compareFn?: (a: number, b: number) => number): this
    {
        throw new Error();
    }

    /**
     * Gets a new this view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param _begin - The index of the beginning of the array.
     * @param _end - The index of the end of the array.
     */
    public subarray(_begin: number, _end?: number): TDecayedTypedArrayTuple
    {
        throw new Error();
    }

    /**
     * Converts a number to a string by using the current locale.
     */
    public toLocaleString(): string
    {
        throw new Error();
    }

    /**
     * Returns a string representation of an array.
     */
    public toString(): string
    {
        throw new Error();
    }

    public TTypeGuardTypedArray!: TArray;
}