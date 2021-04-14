/**
 * @public
 * Converts a set into an array of its values.
 *
 * @returns The values of the set.
 *
 * @remarks
 * See {@link setValuesToArray}.
 */
export function setValuesToArray<TItem>(set: Set<TItem>): TItem[]
{
    return Array.from(set.values());
}