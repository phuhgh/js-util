import { IncrementingIdentifierFactory } from "./impl/incrementing-identifier-factory.js";

/**
 * @public
 * Utilities for generating identifiers.
 */
export class _Identifier
{
    /**
     * @public
     * Returns an integer that increases by 1 every call, starting from 1.
     */
    public static getNextIncrementingId(): number
    {
        return _Identifier.globalUidFactory.getNextId();
    }

    private constructor()
    {
    }

    private static globalUidFactory = new IncrementingIdentifierFactory();
}