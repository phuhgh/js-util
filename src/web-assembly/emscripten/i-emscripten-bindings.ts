/**
 * @public
 * Emscripten library bindings used by util.
 */
export interface IEmscriptenBindings
{
    _malloc(size: number): number;
    _free(ptr: number): void;
    runtimeKeepalivePush(): void;
    runtimeKeepalivePop(): void;
}