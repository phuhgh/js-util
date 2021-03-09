import { _Debug } from "../../debug/_debug";

export function mathBoundRandom(min: number, max: number): number
{
    DEBUG_MODE && _Debug.assert(min < max, "min must be smaller than max");

    return Math.random() * (max - min) + min;
}