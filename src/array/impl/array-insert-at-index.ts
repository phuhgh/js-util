/**
 * @public
 * Modifies input array by inserting at given index.
 * @param items - The array to modify.
 * @param itemToInsert - The thing to insert.
 * @param insertAtIndex - Where to insert it. Pun intended.
 *
 * @remarks
 * See {@link arrayInsertAtIndex}.
 */
export function arrayInsertAtIndex<TItem>(items: TItem[], itemToInsert: TItem, insertAtIndex: number): void
{
    items.splice(insertAtIndex, 0, itemToInsert);
}