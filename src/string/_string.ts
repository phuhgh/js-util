import { stringNormalizeEmptyToUndefined } from "./impl/string-normalize-empty-to-undefined";
import { stringNormalizeNullUndefinedToEmpty } from "./impl/string-normalize-null-undefined-to-empty";

/**
 * @public
 * Utilities that apply to `string`.
 */
// tslint:disable-next-line:class-name
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