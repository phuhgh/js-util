import { numberGetHexString } from "./impl/number-get-hex-string.js";
import { _F32 } from "./impl/_f32.js";
import { _F64 } from "./impl/_f64.js";

/**
 * @public
 * Utilities that apply to numbers.
 */
export class _Number
{
    /** {@inheritDoc _F32} */
    public static f32 = _F32;

    /** {@inheritDoc _F64} */
    public static f64 = _F64;

    /** {@inheritDoc numberGetHexString} */
    public static readonly getHexString = numberGetHexString;

    private constructor()
    {
    }
}
