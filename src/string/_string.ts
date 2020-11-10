import { stringNormalizeEmptyToUndefined } from "./impl/string-normalize-empty-to-undefined";
import { stringNormalizeNullUndefinedToEmpty } from "./impl/string-normalize-null-undefined-to-empty";

// tslint:disable-next-line:class-name
export class _String
{
    public static readonly normalizeEmptyToUndefined = stringNormalizeEmptyToUndefined;
    public static readonly normalizeNullUndefinedToEmpty = stringNormalizeNullUndefinedToEmpty;

    private constructor()
    {
    }
}