import { stringNormalizeEmptyToUndefined } from "./impl/string-normalize-empty-to-undefined.js";
import { stringNormalizeNullUndefinedToEmpty } from "./impl/string-normalize-null-undefined-to-empty.js";
import { stringConcat2 } from "./impl/string-concat-2.js";

/**
 * @public
 * Utilities that apply to `string`.
 */
export class _String
{
    /** {@inheritDoc stringConcat2} */
    public static readonly concat2 = stringConcat2;

    /** {@inheritDoc stringNormalizeEmptyToUndefined} */
    public static readonly normalizeEmptyToUndefined = stringNormalizeEmptyToUndefined;

    /** {@inheritDoc stringNormalizeNullUndefinedToEmpty} */
    public static readonly normalizeNullUndefinedToEmpty = stringNormalizeNullUndefinedToEmpty;

    private constructor()
    {
    }
}