import type { IInteropBindings } from "../web-assembly/emscripten/i-interop-bindings.js";

export interface IEntityGroupBindings
    extends IInteropBindings
{
    _vtCreateGroup(): number;
    _vtAddEntityToGroup(groupPtr: number, entityPtr: number): boolean;
    _vtRemoveEntityFromGroup(groupPtr: number, entityPtr: number): boolean;
    _vtCreateEntity(): number;
}