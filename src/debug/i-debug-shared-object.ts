/**
 * @public
 * See {@link ISharedObject}.
 */
export interface IDebugSharedObject
{
    isStatic: boolean;
    getPtr(): number;
}