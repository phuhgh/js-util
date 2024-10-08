import { ISharedObject } from "../../lifecycle/i-shared-object.js";
import { IReferenceCountedPtr } from "../util/reference-counted-ptr.js";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { IMemoryUtilBindings } from "../emscripten/i-memory-util-bindings.js";
import { ReferenceCountedSharedObject } from "../util/reference-counted-shared-object.js";
import { ILinkedReferences } from "../../lifecycle/linked-references.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import { _Production } from "../../production/_production.js";
import type { IWorkerPoolBindings } from "./i-worker-pool-bindings.js";
import { promisePoll } from "../../promise/impl/promise-poll.js";
import { _Debug } from "../../debug/_debug.js";
import { NestedError } from "../../error-handling/nested-error.js";

/**
 * @public
 * How to handle jobs which don't "overflow", i.e. the workers cannot keep up with the work being sent.
 */
export enum EWorkerPoolOverflowMode
{
    /**
     * Delete the job and then throw a {@link NestedError} with a cause of {@link WorkerPoolErrorCause.overflow}.
     * @remarks This is intended mainly for unit tests.
     * @remarks Ownership of the job is transferred to the job queue.
     */
    Throw = 1,
    /**
     * If no worker is able to accept the job, the job runs on the producer (caller) thread. This automatically
     * "fixes" backpressure by throttling the caller thread. This will result in degraded performance on the producer thread
     * (often the UI thread) which is not always desirable.
     * @remarks {@link IWorkerPool.addJob} will return false where the job ran synchronously.
     * @remarks Ownership of the job is transferred to the job queue.
     */
    Synchronous,
    /**
     * Do nothing, it's up to you to choose an action.
     * @remarks {@link IWorkerPool.addJob} will return false where the job did not run.
     * @remarks Ownership of the job is NOT transferred to the job queue, the caller must clean up.
     */
    Noop,
}

/**
 * @public
 * The static members are the cause in {@link INestedError}.
 */
export class WorkerPoolErrorCause
{
    public static readonly overflow = Symbol("overflow");
}

/**
 * @public
 * Configuration for a {@link IWorkerPool}.
 */
export interface IWorkerPoolConfig
{
    /**
     * The number of threads in the pool.
     */
    readonly workerCount: number;
    /**
     * The number of jobs each thread can buffer.
     * Tune this in conjunction with the distribution strategy, # of workers and queue size to meet your needs.
     */
    readonly queueSize: number;

    readonly overflowMode?: EWorkerPoolOverflowMode;
}

/**
 * @public
 * A shared pool of web workers to run jobs off the main thread.
 * @remarks The pool should be stopped before being destroyed to avoid deadlocks.
 * @remarks Use the batching system to work out when a particular set of jobs has been completed.
 * @remarks If you know the number of threads you need, use `-sPTHREAD_POOL_SIZE=` to allocate them up front.
 */
export interface IWorkerPool
    extends ISharedObject
{
    /**
     * @returns The number of workers that started.
     */
    start(): Promise<number>;
    stop(): Promise<void>;

    /// @returns true if there is at least one worker capable of taking jobs (one worker or more in eRUNNING state).
    isRunning(): boolean;

    /**
     * Transfer unique ownership of the job to the pool. If the pool is running, the job should eventually be run.
     * @remarks The job is deleted on completion.
     */
    addJob(jobPtr: number): boolean;
    /**
     * True if there is any job which has yet to be run. The answer is guaranteed correct on the producer thread.
     */
    hasPendingWork(): boolean;
    /**
     * After adding jobs, you can mark the last job on each worker to track when they have all be completed using {@link IWorkerPool.isBatchDone}.
     */
    setBatchEnd(): void;
    /**
     * This can be polled using {@link promisePoll}.;
     */
    isBatchDone(): boolean;
    /**
     * Cancel any outstanding jobs, does not kill the current job (which must complete first).
     */
    invalidateBatch(): void;
    /**
     * Becomes true once only "valid" jobs are running (use in combination with {@link IWorkerPool.invalidateBatch}). Alternately,
     * you can check {@link IWorkerPool.isBatchDone} if you don't need to start a new batch right away.
     */
    areWorkersSynced(): boolean;
}

/**
 * @public
 * {@inheritDoc IWorkerPool}
 */
export class WorkerPool implements IWorkerPool
{
    public static createRoundRobin
    (
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings & IWorkerPoolBindings>,
        config: IWorkerPoolConfig,
        bindToReference: ILinkedReferences | null,
        allocationFailThrows: boolean,
    )
        : WorkerPool | null;
    public static createRoundRobin
    (
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings & IWorkerPoolBindings>,
        config: IWorkerPoolConfig,
        bindToReference: ILinkedReferences | null,
    )
        : WorkerPool;
    public static createRoundRobin
    (
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings & IWorkerPoolBindings>,
        config: IWorkerPoolConfig,
        bindToReference: ILinkedReferences | null,
        allocationFailThrows: boolean = true,
    )
        : WorkerPool | null
    {
        _BUILD.DEBUG && wrapper.debug.onAllocate.emit();
        const overflowMode = config.overflowMode ?? EWorkerPoolOverflowMode.Synchronous;

        const maxSize = 0xFFFF;
        if (config.workerCount > maxSize)
        {
            throw _Production.createError(`Requested pool size ${config.workerCount}, exceeds limit ${maxSize}.`);
        }

        if (config.queueSize > maxSize)
        {
            throw _Production.createError(`Requested queue size ${config.queueSize}, exceeds limit ${maxSize}.`);
        }

        const pointer = wrapper.instance._workerPool_createRoundRobin(
            config.workerCount,
            config.queueSize,
            overflowMode === EWorkerPoolOverflowMode.Synchronous,
        );

        if (pointer == nullPtr)
        {
            if (allocationFailThrows)
            {
                throw _Production.createError("Failed to allocate memory for shared memory block.");
            }
            else
            {
                return null;
            }
        }

        const pool = new WorkerPool(wrapper, pointer, overflowMode);
        bindToReference?.linkRef(pool.sharedObject);

        return pool;
    }

    public readonly sharedObject: IReferenceCountedPtr;

    public start(): Promise<number>
    {
        _BUILD.DEBUG && _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
        const started = this.wrapper.instance._workerPool_start(this.sharedObject.getPtr());

        return promisePoll(() => this.wrapper.instance._workerPool_isAcceptingJobs(this.sharedObject.getPtr()))
            .getPromise()
            .then(() => started);
    }

    public stop(): Promise<void>
    {
        _BUILD.DEBUG && _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
        this.wrapper.instance._workerPool_stop(this.sharedObject.getPtr(), false);

        return promisePoll(() => !this.wrapper.instance._workerPool_isAnyWorkerRunning(this.sharedObject.getPtr()))
            .getPromise()
            .then(() => undefined);
    }

    public isRunning(): boolean
    {
        _BUILD.DEBUG && _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
        return Boolean(this.wrapper.instance._workerPool_isAnyWorkerRunning(this.sharedObject.getPtr()));
    }

    public isBatchDone(): boolean
    {
        _BUILD.DEBUG && _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
        return Boolean(this.wrapper.instance._workerPool_isBatchDone(this.sharedObject.getPtr()));
    }

    public setBatchEnd(): void
    {
        _BUILD.DEBUG && _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
        this.wrapper.instance._workerPool_setBatchEndPoint(this.sharedObject.getPtr());
    }

    public invalidateBatch(): void
    {
        _BUILD.DEBUG && _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
        this.wrapper.instance._workerPool_invalidateBatch(this.sharedObject.getPtr());
    }

    public areWorkersSynced(): boolean
    {
        return Boolean(this.wrapper.instance._workerPool_areWorkersSynced(this.sharedObject.getPtr()));
    }

    public hasPendingWork(): boolean
    {
        _BUILD.DEBUG && _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
        return Boolean(this.wrapper.instance._workerPool_hasPendingWork(this.sharedObject.getPtr()));
    }

    public addJob(jobPtr: number): boolean
    {
        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
            _Debug.assert(jobPtr !== nullPtr, "expected job, got nullptr");
        });
        const added = this.wrapper.instance._workerPool_addJob(this.sharedObject.getPtr(), jobPtr);
        if (!added)
        {
            switch (this.overflowMode)
            {
                case EWorkerPoolOverflowMode.Noop: // intentional fallthrough
                case EWorkerPoolOverflowMode.Synchronous:
                    break;
                case EWorkerPoolOverflowMode.Throw:
                {
                    this.wrapper.instance._workerPool_deleteJob(jobPtr);
                    throw new NestedError("WorkerPool overflow", WorkerPoolErrorCause.overflow);
                }
                default:
                    _Production.assertValueIsNever(this.overflowMode);
            }
        }
        return added;
    }

    protected constructor
    (
        private readonly wrapper: IEmscriptenWrapper<IMemoryUtilBindings & IWorkerPoolBindings>,
        pointer: number,
        overflowMode: EWorkerPoolOverflowMode,
    )
    {
        this.sharedObject = new ReferenceCountedSharedObject(pointer, wrapper);
        this.overflowMode = overflowMode;
    }

    private readonly overflowMode: EWorkerPoolOverflowMode;
}
