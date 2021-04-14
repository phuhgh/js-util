export function pathJoin(start: string, end: string, separator: string = "/"): string
{
    const startEndsWithSeparator = start[start.length - 1] === separator;
    const endStartsWithSeparator = end[0] === separator;

    if (startEndsWithSeparator)
    {
        if (endStartsWithSeparator)
        {
            return start.concat(end.substring(1));
        }
        else
        {
            return start.concat(end);
        }
    }
    else
    {
        if (endStartsWithSeparator)
        {
            return start.concat(end);
        }
        else
        {
            return `${start}${separator}${end}`;
        }
    }
}