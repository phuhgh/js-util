import { runTimeGetGlobalObject } from "./impl/run-time-get-global-object";

/**
 * @public
 * Utilities relating to the runtime environment (e.g. browser, node, ...)
 */
export class _RunTime
{
    public static isLittleEndian: boolean = new DataView(new Float32Array([1]).buffer).getFloat32(0, true) === 1;

    /** {@inheritDoc runTimeGetGlobal} */
    public static getGlobalObject = runTimeGetGlobalObject;

    private constructor()
    {
    }
}