import { IDictionary } from "../typescript/i-dictionary";

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @public
 * Method decorator. The target will be called only once, subsequent calls will return the first return.
 */
export function Once(): any
{
    return function (target: IDictionary<(...args: any[]) => any>, key: string, descriptor: PropertyDescriptor): void
    {
        const original = target[key];
        const results = new WeakMap();

        target[key] = descriptor.value = function (this: any, ...args: any[]): any
        {
            if (results.has(this))
            {
                return results.get(this);
            }

            const result = original.apply(this, args);
            results.set(this, result);

            return result;
        };
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const console: any;