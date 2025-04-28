import type { ENumberIdentifier } from "../../runtime/rtti-interop.js";
import type { IInteropBindings } from "../emscripten/i-interop-bindings.js";

/**
 * @public
 */
export enum EVectorIdentifier
{
    Vec2 = 0,
    Vec3,
    Vec4,
    Mat2,
    Mat3,
    Mat4,
    Range2d
}

/**
 * @public
 */
export interface ISharedVectorBindings extends IInteropBindings
{
    _jsUtilCreateVec(numberId: ENumberIdentifier, vectorId: EVectorIdentifier): number;
}