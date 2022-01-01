/**
 * @public
 * Escapes RegExp special characters in strings.
 *
 * @returns The escaped string.
 *
 * @remarks
 * See {@link regexEscapeRegex}.
 */
export function regexEscapeRegex(value: string): string
{
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    return value.replace(/[.*+\-?^${}()|[\]\\]/g, `\\$&`);
}