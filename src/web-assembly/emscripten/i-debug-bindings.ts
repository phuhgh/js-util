/**
 * @public
 * Emscripten bindings for debugging.
 */
export interface IDebugBindings
{
    _jsUtilEndProgram(statusCode: number): void;
}