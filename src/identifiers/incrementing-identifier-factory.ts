import { IIdentifierFactory } from "./i-identifier-factory";

/**
 * @public
 * Provides an incrementing integer identifier.
 *
 * @remarks
 * By default the first ID will be 0, this may be configured at construction.
 */
export class IncrementingIdentifierFactory implements IIdentifierFactory
{
    public constructor(
        private id = 0,
    )
    {
    }

    public getNextId(): number
    {
        return this.id++;
    }
}