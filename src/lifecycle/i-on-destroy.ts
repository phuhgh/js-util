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
    protected onDestroyListener: ITemporaryListener<[]> = new TemporaryListener<[]>();

    public onDestroy(): void
    {
        this.onDestroyListener.clearingEmit();
    }
}
