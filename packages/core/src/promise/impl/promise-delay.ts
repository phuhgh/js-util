/**
 * @public
 * Returns a `Promise` which will resolve to `resolveWith` after a delay of `delay` (in milliseconds).
 *
 * @remarks
 * See {@link promiseDelay}.
 */
export function promiseDelay<T>(resolveWith: T, delay: number = 4): Promise<T>
{
    return new Promise((done) =>
    {
        setTimeout(
            () =>
            {
                done(resolveWith);
            },
            delay,
        );
    });
}

declare function setTimeout(handler: () => void, timeout?: number, ...arguments: unknown[]): number;