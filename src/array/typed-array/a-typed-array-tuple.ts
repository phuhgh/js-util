import { TTupleLikeOfLength } from "../../typescript/t-tuple-like-of-length";

/**
 * @public
 * Common methods of typed arrays, extend to make typed array tuples.
 */
export abstract class ATypedArrayTuple<TLength extends number>
{
    /**
     * The size in bytes of each element in the array.
     */
    public abstract readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    public abstract readonly buffer: ArrayBufferLike;

    /**
     * The length in bytes of the array.
     */
    public abstract readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    public abstract readonly byteOffset: number;
    /**
     * The length of the array.
     */
    public abstract readonly length: TLength;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target - If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start - If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end - If not specified, length of the this object is used as its default value.
     */
    public abstract copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param callbackfn - A function that accepts up to three arguments. The every method calls
     * the callbackfn function for each element in array1 until the callbackfn returns false,
     * or until the end of the array.
     * @param thisArg - An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    public abstract every(callbackfn: (value: number, index: Extract<keyof this, number>, array: this) => boolean, thisArg?: unknown): boolean;

    /**
     * Returns the this object after filling the section identified by start and end with value
     * @param value - value to fill array section with
     * @param start - index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end - index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    public abstract fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param callbackfn - A function that accepts up to three arguments. The filter method calls
     * the callbackfn function one time for each element in the array.
     * @param thisArg - An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    public abstract filter(callbackfn: (value: number, index: Extract<keyof this, number>, array: this) => unknown, thisArg?: unknown): ATypedArrayTuple<number>;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate - find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg - If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    public abstract find(predicate: (value: number, index: Extract<keyof this, number>, obj: this) => boolean, thisArg?: unknown): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate - find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg - If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    public abstract findIndex(predicate: (value: number, index: Extract<keyof this, number>, obj: this) => boolean, thisArg?: unknown): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn -  A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg -  An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    public abstract forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: unknown): void;

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement - The value to locate in the array.
     * @param fromIndex - The array index at which to begin the search. If fromIndex is omitted, the
     *  search starts at index 0.
     */
    public abstract indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator - A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    public abstract join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement - The value to locate in the array.
     * @param fromIndex - The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    public abstract lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn - A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg - An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    public abstract map(callbackfn: (value: number, index: Extract<keyof this, number>, array: this) => number, thisArg?: unknown): this;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn - A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue - If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    public abstract reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: Extract<keyof this, number>, array: this) => number): number;
    public abstract reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: Extract<keyof this, number>, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn - A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue - If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    public abstract reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: Extract<keyof this, number>, array: this) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn - A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue - If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    public abstract reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: Extract<keyof this, number>, array: this) => number): number;
    public abstract reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: Extract<keyof this, number>, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn - A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue - If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    public abstract reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: Extract<keyof this, number>, array: this) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    public abstract reverse(): this;

    /**
     * Sets a value or an array of values.
     * @param array - A typed or untyped array of values to set.
     * @param offset - The index in the current array at which the values are to be written.
     */
    public abstract set(array: TTupleLikeOfLength<number, TLength>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start - The beginning of the specified portion of the array.
     * @param end - The end of the specified portion of the array.
     */
    public abstract slice(start?: number, end?: number): this;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callbackfn - A function that accepts up to three arguments. The some method calls the
     * callbackfn function for each element in array1 until the callbackfn returns true, or until
     * the end of the array.
     * @param thisArg - An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    public abstract some(callbackfn: (value: number, index: Extract<keyof this, number>, array: this) => boolean, thisArg?: unknown): boolean;

    /**
     * Sorts an array.
     * @param compareFn - The name of the function used to determine the order of the elements. If
     * omitted, the elements are sorted in ascending, ASCII character order.
     */
    public abstract sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new this view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin - The index of the beginning of the array.
     * @param end - The index of the end of the array.
     */
    public abstract subarray(begin: number, end?: number): this;

    /**
     * Converts a number to a string by using the current locale.
     */
    public abstract toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    public abstract toString(): string;
}