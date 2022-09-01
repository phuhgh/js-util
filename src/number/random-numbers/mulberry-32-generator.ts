import { IRandomNumberGenerator } from "./i-random-number-generator.js";

/**
 * @public
 * Random number generator.
 */
export class Mulberry32Generator implements IRandomNumberGenerator
{
    public constructor
    (
        private seed: number,
    )
    {
    }

    public getNext(): number
    {
        let value = this.seed += 0x6D2B79F5;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) * 2.3283064365386963e-10;
    }
}
