import { stringNormalizeEmptyToUndefined } from "./impl/string-normalize-empty-to-undefined.js";
import { stringNormalizeNullUndefinedToEmpty } from "./impl/string-normalize-null-undefined-to-empty.js";

/**
 * @public
 * Utilities that apply to `string`.
 */
export class _String
{
    /** {@inheritDoc stringNormalizeEmptyToUndefined} */
    public static readonly normalizeEmptyToUndefined = stringNormalizeEmptyToUndefined;

    /** {@inheritDoc stringNormalizeNullUndefinedToEmpty} */
    public static readonly normalizeNullUndefinedToEmpty = stringNormalizeNullUndefinedToEmpty;

    private constructor()
    {
    }
}