import { ITemporaryListener, TemporaryListener } from "./temporary-listener.js";

/**
 * @public
 * Provides a {@link ITemporaryListener} that is cleared on `onDestroy`.
 */
export interface IOnDestroy
{
    onDestroy(): void;
}

/**
 * @public
 * {@inheritDoc ITemporaryListener}
 */
export class AOnDestroy implements IOnDestroy
{
    protected onDestroyListener: ITemporaryListener<[]> = new TemporaryListener<[]>();

    public onDestroy(): void
    {
        this.onDestroyListener.clearingEmit();
    }
}
