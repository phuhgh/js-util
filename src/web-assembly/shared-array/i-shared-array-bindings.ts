import { TProperty } from "../../typescript/t-property.js";

/**
 * @public
 */
export type TSharedArrayPrefix = "f64SharedArray" | "f32SharedArray";

/**
 * @public
 */
export interface ISharedArrayBindings
    extends TProperty<`_${TSharedArrayPrefix}_createOne`, (size: number, clearMemory: boolean) => number>,
            TProperty<`_${TSharedArrayPrefix}_getArrayAddress`, (objPointer: number) => number>,
            TProperty<`_${TSharedArrayPrefix}_delete`, (objPointer: number) => void>
{
}