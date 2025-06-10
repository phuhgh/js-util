/**
 * @public
 * A Boyer-Moore-Horspool search algorithm. Use {@link stringCreateHorspoolTable} to create the needle.
 * Supports utf-16.
 *
 * Adapted from:
 * https://github.com/FooBarWidget/boyer-moore-horspool/blob/master/Horspool.cpp
 *
 * @param haystack - The thing to search.
 * @param needle - The thing to search for.
 * @param startIndex - Where to start searching.
 */
export function stringSearchInHorspool
(
    haystack: string,
    needle: Needle,
    startIndex: number = 0
)
    : number
{
    const needle_length = needle.value.length;
    const haystack_length = haystack.length;
    const needle_value = needle.value;
    if (needle_length > haystack_length)
    {
        return -1;
    }
    if (needle_length == 0)
    {
        // consistent with indexOf
        return 0;
    }
    if (needle_length == 1)
    {
        return haystack.indexOf(needle_value, startIndex);
    }


    const needle_length_minus_1 = needle_length - 1;
    const last_needle_char = needle_value.charCodeAt(needle_length_minus_1);

    let haystack_position = startIndex;
    while (haystack_position <= haystack_length - needle_length)
    {
        const occ_char = haystack.charCodeAt(haystack_position + needle_length_minus_1);
        if (last_needle_char == occ_char && matchNeedleHaystack(needle_value, haystack, haystack_position, needle_length_minus_1))
        {
            return haystack_position;
        }

        haystack_position += needle.resolve(occ_char);
    }
    return -1;
}

function matchNeedleHaystack
(
    needle: string,
    haystack: string,
    haystackPosition: number,
    matchLength: number
)
    : boolean
{
    for (let i = 0; i < matchLength; ++i)
    {
        if (needle[i] !== haystack[haystackPosition + i])
        {
            return false;
        }
    }
    return true;
}

/**
 * @public
 * For use with {@link stringSearchInHorspool}.
 */
export class Needle
{
    public constructor
    (
        public readonly value: string,
        private readonly table: Map<number, number>,
    )
    {
    }

    public resolve(characterCode: number): number
    {
        return this.table.get(characterCode) ?? this.value.length;
    }
}

/**
 * @public
 * Creates the needle for {@link stringSearchInHorspool}.
 * @param needle - The thing to search for.
 */
export function stringCreateHorspoolTable(needle: string): Needle
{
    const table = new Map<number, number>();

    const needle_length = needle.length;
    if (needle_length >= 1)
    {
        const needle_length_minus_1 = needle_length - 1;
        for (let a = 0; a < needle_length_minus_1; ++a)
        {
            table.set(needle.charCodeAt(a), needle_length_minus_1 - a);
        }
    }
    return new Needle(needle, table);
}

/**
 * @public
 * Uses {@link stringSearchInHorspool} to count instances of needle. Use {@link stringCreateHorspoolTable} to create the needle.
 * Supports utf-16.
 * @param haystack - The thing to search.
 * @param needle - The thing to search for.
 * @param startIndex - Where to start searching.
 */
export function stringCountOccurrences
(
    haystack: string,
    needle: Needle,
    startIndex: number = 0
)
    : number
{
    let count = 0;
    let currentIndex = startIndex;

    while (currentIndex < haystack.length) {
        const foundIndex = stringSearchInHorspool(haystack, needle, currentIndex);
        if (foundIndex === -1) {
            break;
        }
        count++;
        currentIndex = foundIndex + 1;
    }

    return count;
}
