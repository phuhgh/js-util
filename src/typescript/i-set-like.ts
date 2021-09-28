import { IReadonlySetLike } from "./i-readonly-set-like";

/**
 * @public
 */
export interface ISetLike<TItem> extends IReadonlySetLike<TItem>
{
    add(item: TItem): void;
    delete(item: TItem): boolean;
}