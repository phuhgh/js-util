export function regexEscapeRegex(value: string): string
{
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    return value.replace(/[.*+\-?^${}()|[\]\\]/g, `\\$&`);
}