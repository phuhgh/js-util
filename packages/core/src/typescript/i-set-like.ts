import { IReadonlySetLike } from "./i-readonly-set-like";

/**
 * @public
 */
export interface ISetLike<TItem> extends IReadonlySetLike<TItem>
{
    add(item: TItem): void;
    /**
     * @returns true if the item was deleted.
     */
    delete(item: TItem): boolean;
    clear(): void;
    readonly size: number;
}