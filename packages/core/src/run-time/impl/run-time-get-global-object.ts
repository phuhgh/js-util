import { IDictionary } from "@rc-js-util/types";

export function runTimeGetGlobalObject(): IDictionary<unknown>
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