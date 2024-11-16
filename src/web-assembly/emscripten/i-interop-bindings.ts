/**
 * @public
 */
export interface IInteropBindings
{
    _jsUtilAddRuntimeMappings(count: number, o_sharedObjectPtr: number): number;
    _jsUtilRemoveRuntimeMappings(ptr: number, o_sharedObjectPtr: number): void;
    _jsUtilGetRuntimeMappingAddress(): number;
    _jsUtilHasRuntimeMappingId(sharedObjectPtr: number, catId: number, specId: number): boolean;
    _jsUtilGetRuntimeMappingId(namePtr: number): number;
}
