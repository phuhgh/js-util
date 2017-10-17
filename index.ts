export interface IDictionary<T>
{
    [index: string]: T;
}

export function undictionaryify<T>(d: IDictionary<T>): T[]
{
    const keys = Object.keys(d);
    const l = keys.length;
    const a = new Array<T>(keys.length);
    
    for (let i = 0; i < l; ++i)
    {
        a[i] = d[keys[i]];
    }

    return a;
}