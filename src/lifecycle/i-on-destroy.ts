import { ITemporaryListener, TemporaryListener } from "./temporary-listener";

/**
 * @public
 */
export interface IOnDestroy
{
    onDestroy(): void;
}

/**
 * @public
 */
export class AOnDestroy implements IOnDestroy
{
    protected onDestroyListener: ITemporaryListener<void> = new TemporaryListener<void>();

    public onDestroy(): void
    {
        this.onDestroyListener.clearingEmit();
    }
}
