
import type { IDirtyCheckedTrait } from "./traits/i-dirty-checked-trait.js";
import type { IDisabledTrait } from "./traits/i-disabled-trait.js";
import type { IIdentifierFactory } from "../identifier/impl/i-identifier-factory.js";

// todo jack: rename
/**
 * @public
 * Base chart entity. Meets the basic requirements to be included in an update-scheduling group. It's not required that you meet this in all cases.
 */
export interface IChartEntity
    extends IDirtyCheckedTrait,
            IDisabledTrait
{
}

// todo jack: is this used any more?
/**
 * @public
 * An implementation of {@link IChartEntity}, usage is entirely optional!
 */
export class ChartEntity
    implements IChartEntity
{
    public changeId: number = -1;
    public isDirty: boolean = true;
    public isDisabled = false;

    public markDirty(): void
    {
        this.isDirty = true;
    }

    public updateChangeId(changeIdFactory: IIdentifierFactory): void
    {
        this.isDirty = false;
        this.changeId = changeIdFactory.getNextId();
    }
}
