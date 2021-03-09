import { numberGetHexString } from "./impl/number-get-hex-string";

/**
 * @public
 * Utilities that apply to numbers.
 */
export class _Number
{
    /** {@inheritDoc numberGetHexString} */
    public static readonly getHexString = numberGetHexString;

    private constructor()
    {
    }
}