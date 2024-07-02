import { fpIdentity } from "../../fp/impl/fp-identity.js";

/**
 * @public
 * Provides a way to poll without busy waiting. Useful for synchronization with workers, particularly with shared memory.
 */
export interface INonblockingPoll
{
    cancel(): void;
    getPromise(): Promise<EResolutionState>;
}

/**
 * @public
 */
export enum EResolutionState
{
    Resolved,
    TimedOut,
    Cancelled,
}

/**
 * @public
 * @param predicate - Once true, the poll finishes. Exceptions are not supported.
 * @param pollInterval - In milliseconds, defaults to smallest (probably 4 ms).
 * @param maxTicks - The number of times to run the poll before giving up.
 */
export function promisePoll(
    predicate: () => boolean,
    pollInterval: number | undefined = undefined,
    maxTicks: number = Infinity,
)
    : INonblockingPoll
{
    return new PromisePoll(predicate, pollInterval, maxTicks);
}

class PromisePoll implements INonblockingPoll
{
    public constructor
    (
        private callback: () => boolean,
        private timeout: number | undefined,
        private maxTicks: number,
    )
    {
        this.promise = new Promise((resolve) =>
        {
            this.resolve = resolve;
            this.id = setInterval(() =>
            {
                if (this.tickCount++ >= this.maxTicks)
                {
                    this.cancel(EResolutionState.TimedOut);
                }
                else if (this.callback())
                {
                    this.cancel(EResolutionState.Resolved);
                }
            }, this.timeout);
        });
    }

    public getPromise(): Promise<EResolutionState>
    {
        return this.promise;
    }

    public cancel(reason: EResolutionState = EResolutionState.Cancelled): void
    {
        if (this.id != null)
        {
            clearInterval(this.id);
            this.id = null;
            this.resolve(reason);
        }
    }

    private readonly promise: Promise<EResolutionState>;
    private resolve: (reason: EResolutionState) => void = fpIdentity;
    private id: number | null = null;
    private tickCount: number = 0;
}

declare function setInterval(handler: () => void, timeout?: number, ...arguments: unknown[]): number;

declare function clearInterval(id: number): number;