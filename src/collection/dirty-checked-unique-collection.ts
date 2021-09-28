import { ISetLike } from "../typescript/i-set-like";

/**
 * @public
 * Provides a unique array with O(1) add & remove, with dirty checking on `getArray`.
 */
export interface IDirtyCheckedUniqueCollection<TItem>
{
    readonly isDirty: boolean;
    add(item: TItem): void;
    reportingAdd(item: TItem): boolean;
    delete(item: TItem): boolean;
    clear(): void;
    getArray(): readonly TItem[];
    getSet(): ReadonlySet<TItem>;
}

/**
 * @public
 * {@inheritDoc IDirtyCheckedUniqueCollection}
 */
export class DirtyCheckedUniqueCollection<TItem>
    implements IDirtyCheckedUniqueCollection<TItem>,
               ISetLike<TItem>
{
    public isDirty = true;

    public constructor
    (
        itemsToCopy?: readonly TItem[] | ReadonlySet<TItem>,
    )
    {
        this.itemsSet = new Set(itemsToCopy);
    }

    public add(item: TItem): void
    {
        this.itemsSet.add(item);
        this.isDirty = true;
    }

    public reportingAdd(item: TItem): boolean
    {
        if (this.itemsSet.has(item))
        {
            return false;
        }

        this.itemsSet.add(item);
        this.isDirty = true;

        return true;
    }

    public delete(item: TItem): boolean
    {
        const deletedItem = this.itemsSet.delete(item);
        this.isDirty ||= deletedItem;

        return deletedItem;
    }

    public has(item: TItem): boolean
    {
        return this.itemsSet.has(item);
    }

    public clear(): void
    {
        this.isDirty ||= this.itemsSet.size > 0;
        this.itemsSet.clear();
    }

    public getArray(): readonly TItem[]
    {
        if (this.isDirty)
        {
            this.itemsArray = Array.from(this.itemsSet);
            this.isDirty = false;
        }

        return this.itemsArray;
    }

    public getSet(): ReadonlySet<TItem>
    {
        return this.itemsSet;
    }

    private readonly itemsSet: Set<TItem>;
    private itemsArray: TItem[] = [];
}