export function pathJoin(start: string, end: string, separator: string  = "/"): string
{
    if (doesStringEndWithForwardSlash(start, separator))
    {
        if (doesStringStartWithForwardSlash(end, separator))
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
        if (doesStringStartWithForwardSlash(end, separator))
        {
            return start.concat(end);
        }
        else
        {
            return `${start}${separator}${end}`;
        }
    }
}

function doesStringEndWithForwardSlash(str: string, separator: string): boolean
{
    return str[str.length - 1] === separator;
}

function doesStringStartWithForwardSlash(str: string, separator: string): boolean
{
    return str[0] === separator;
}