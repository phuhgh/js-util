import { numberGetHexString } from "./impl/number-get-hex-string";
import { _F32 } from "./impl/_f32";
import { _F64 } from "./impl/_f64";

/**
 * @public
 * Utilities that apply to numeric types.
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