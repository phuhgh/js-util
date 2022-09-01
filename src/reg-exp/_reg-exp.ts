import { regexEscapeRegex } from "./impl/regex-escape-regex.js";

/**
 * @public
 * Utilities that apply to `RegExp`.
 */
export class _RegExp
{
    /** {@inheritDoc regexEscapeRegex} */
    public static readonly escapeRegex = regexEscapeRegex;

    private constructor()
    {
    }
}