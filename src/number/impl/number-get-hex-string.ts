const tmp = ["0x", 0];

/**
 * @public
 * Returns the hex representation of the number. If it's not a number it returns "NaN".
 */
export function numberGetHexString(value: number): string
{
    if (value !== value)
    {
        return "NaN";
    }

    tmp[1] = value.toString(16).toUpperCase();

    return tmp.join("");
}