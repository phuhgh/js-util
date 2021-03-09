import type { IDictionary } from "../typescript/i-dictionary";

export function getGlobal(): IDictionary<unknown>
{
    if (typeof global !== "undefined")
    {
        return global;
    }

    if (typeof window !== "undefined")
    {
        return window;
    }

    throw new Error("unsupported environment");
}

declare let global: IDictionary<unknown>;
declare let window: IDictionary<unknown>;