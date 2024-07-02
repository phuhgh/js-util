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
    start(): Promise<void>;
    stop(): Promise<void>;
    isRunning(): boolean;

    /**
     * Transfer unique ownership of the job to the pool. If the pool is running, the job should eventually be run.
     * @remarks The job is deleted on completion.
     */
    addJob(jobPointer: number): void;
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
        const pointer = wrapper.instance._workerPool_createRoundRobin(
            config.workerCount,
            config.queueSize,
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

        const pool = new WorkerPool(wrapper, pointer);
        bindToReference?.linkRef(pool.sharedObject);

        return pool;
    }

    public readonly sharedObject: IReferenceCountedPtr;

    public start(): Promise<void>
    {
        _BUILD.DEBUG && _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
        this.wrapper.instance._workerPool_start(this.sharedObject.getPtr());

        return promisePoll(() => this.wrapper.instance._workerPool_isReady(this.sharedObject.getPtr()))
            .getPromise()
            .then(() => undefined);
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
        this.wrapper.instance._workerPool_setBatchReadyPoint(this.sharedObject.getPtr());
    }

    public hasPendingWork(): boolean
    {
        _BUILD.DEBUG && _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
        return Boolean(this.wrapper.instance._workerPool_hasPendingWork(this.sharedObject.getPtr()));
    }

    public addJob(jobPointer: number): void
    {
        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            _Debug.assert(!this.sharedObject.getIsDestroyed(), "use after free");
            _Debug.assert(jobPointer !== nullPtr, "expected job, got nullptr");
        });
        this.wrapper.instance._workerPool_addJob(this.sharedObject.getPtr(), jobPointer);
    }

    protected constructor
    (
        private readonly wrapper: IEmscriptenWrapper<IMemoryUtilBindings & IWorkerPoolBindings>,
        pointer: number,
    )
    {
        this.sharedObject = new ReferenceCountedSharedObject(pointer, wrapper);
    }
}
