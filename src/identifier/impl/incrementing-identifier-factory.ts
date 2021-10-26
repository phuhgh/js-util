import { IIdentifierFactory } from "./i-identifier-factory";

/**
 * @public
 * Provides an incrementing integer identifier.
 *
 * @remarks
 * By default the first ID will be 1, this may be configured at construction.
 */
export class IncrementingIdentifierFactory implements IIdentifierFactory
{
    public constructor(
        private id = 1,
    )
    {
    }

    public getNextId(): number
    {
        return this.id++;
    }
}