/**
 * @public
 */
export interface IWorkerPoolBindings
{
    _workerPool_createRoundRobin(workerCount: number, queueSize: number): number;
    _workerPool_addJob(o_poolPtr: number, jobPtr: number): void;
    _workerPool_isAnyWorkerRunning(jobPtr: number): boolean;
    _workerPool_isReady(jobPtr: number): boolean;
    _workerPool_hasPendingWork(jobPtr: number): boolean;
    _workerPool_isBatchDone(jobPtr: number): boolean;
    _workerPool_setBatchReadyPoint(jobPtr: number): void;
    _workerPool_start(o_poolPtr: number): number;
    _workerPool_stop(o_poolPtr: number, wait: boolean): void;
    _workerPool_createJob(): number;
}
