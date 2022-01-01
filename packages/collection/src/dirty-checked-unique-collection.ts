import { ISetLike } from "../typescript/i-set-like";

/**
 * @public
 * Provides a unique array with O(1) add & remove, with dirty checking on `getArray`.
 */
export interface IDirtyCheckedUniqueCollection<TItem> extends ISetLike<TItem>
{
    readonly isDirty: boolean;
    /**
     * @returns true if the item was added.
     */
    reportingAdd(item: TItem): boolean;
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
    public get size(): number
    {
        return this.itemsSet.size;
    }

    public isDirty = true;

    public static mapInitializeAdd<TKey, TValue>(map: Map<TKey, IDirtyCheckedUniqueCollection<TValue>>, key: TKey, value: TValue): boolean;
    public static mapInitializeAdd<TKey extends object, TValue>(map: WeakMap<TKey, IDirtyCheckedUniqueCollection<TValue>>, key: TKey, value: TValue): boolean;
    public static mapInitializeAdd<TKey extends object, TValue>
    (
        map: Map<TKey, IDirtyCheckedUniqueCollection<TValue>> | WeakMap<TKey, IDirtyCheckedUniqueCollection<TValue>>,
        key: TKey,
        value: TValue,
    )
        : boolean
    {
        const collection = map.get(key);

        if (collection == null)
        {
            const collection = new DirtyCheckedUniqueCollection<TValue>();
            collection.add(value);
            map.set(key, collection);

            return true;
        }
        else
        {
            return collection.reportingAdd(value);
        }
    }

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