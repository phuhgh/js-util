/**
 * @public
 * Emscripten bindings related to debugging.
 */
export interface IDebugBindings
{
    _isDebugBuild(): boolean;

    _jsUtilEndProgram(statusCode: number): void;
}