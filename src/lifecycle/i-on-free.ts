/**
 * @public
 * A resource that can be freed.
 */
export interface IOnFree
{
    /**
     * Called once the resource is ready to be freed.
     */
    onFree(): void;
}