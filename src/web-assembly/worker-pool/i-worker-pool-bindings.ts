/**
 * @public
 */
export interface IWorkerPoolBindings
{
    _workerPool_createRoundRobin(workerCount: number, queueSize: number, syncOverflowHandling: boolean): number;
    _workerPool_addJob(o_poolPtr: number, jobPtr: number): boolean;
    _workerPool_invalidateBatch(o_poolPtr: number): void;
    _workerPool_isBatchDone(jobPtr: number): boolean;
    _workerPool_setBatchEndPoint(jobPtr: number): void;
    _workerPool_areWorkersSynced(poolPtr: number): boolean;
    _workerPool_isAnyWorkerRunning(jobPtr: number): boolean;
    _workerPool_isAcceptingJobs(jobPtr: number): boolean;
    _workerPool_hasPendingWork(jobPtr: number): boolean;
    _workerPool_start(o_poolPtr: number): number;
    _workerPool_stop(o_poolPtr: number, wait: boolean): void;
    _workerPool_createJob(): number;
    _workerPool_deleteJob(o_jobPtr: number): void;
}
