import { IDictionary } from "../../typescript/i-dictionary";

export function dictionaryPush<TItem>(dict: IDictionary<TItem[]>, key: keyof typeof dict, value: TItem): void
{
    const values = dict[key];

    if (values != null)
    {
        values.push(value);
    }
    else
    {
        dict[key] = [value];
    }
}