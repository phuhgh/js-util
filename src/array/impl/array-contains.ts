import { TTypedArray } from "../typed-array/t-typed-array";

/**
 * @public
 * Returns true if the item is present in the list (=== equality test).
 *
 * @remarks
 * See {@link (arrayContains:1)}.
 */
export function arrayContains(items: TTypedArray, item: number): boolean
/**
 * @public
 * Returns true if the item is present in the list (=== equality test).
 *
 * @remarks
 * See {@link (arrayContains:2)}.
 */
export function arrayContains<TItem>(items: readonly TItem[], item: TItem): boolean
export function arrayContains<TItem>(items: readonly TItem[] | TTypedArray, item: TItem | number): boolean
{
    return (items as TItem[]).indexOf(item as TItem) !== -1;
}