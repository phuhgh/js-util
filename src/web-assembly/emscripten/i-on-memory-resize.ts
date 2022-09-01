import { TListener } from "../../eventing/t-listener.js";

/**
 * @public
 */
export interface IOnMemoryResize extends TListener<"onMemoryResize", []>
{
}