import { IRandomNumberGenerator } from "./i-random-number-generator.js";

/**
 * @public
 * Instead of returning a random number, return the constant instead.
 */
export class NotRandomGenerator implements IRandomNumberGenerator
{
    public constructor
    (
        private readonly value: number
    )
    {
    }

    public getNext(): number
    {
        return this.value;
    }
}