import { IWebAssemblyMemoryMemory } from "./i-web-assembly-memory.js";
import { IEmscriptenBindings } from "../web-assembly/emscripten/i-emscripten-bindings.js";

/* eslint-disable */
/**
 * @public
 * External lib.
 */
export namespace Emscripten
{
    /**
     * @public
     */
    export type EnvironmentType = 'WEB' | 'NODE' | 'SHELL' | 'WORKER';

    /**
     * @public
     */
    export type WebAssemblyImports = Array<{
        name: string;
        kind: string;
    }>;

    /**
     * @public
     */
    export type WebAssemblyExports = Array<{
        module: string;
        name: string;
        kind: string;
    }>;

    /**
     * @public
     */
    export interface EmscriptenModule extends IEmscriptenBindings
    {
        wasmMemory: IWebAssemblyMemoryMemory;
        print(str: string): void;
        printErr(str: string): void;
        arguments: string[];
        environment: EnvironmentType;
        preInit: Array<{ (): void }>;
        preRun: Array<{ (): void }>;
        postRun: Array<{ (): void }>;
        onAbort: { (what: any): void };
        onRuntimeInitialized: { (): void };
        noInitialRun: boolean;
        noExitRuntime: boolean;
        logReadFiles: boolean;
        filePackagePrefixURL: string;
        wasmBinary: ArrayBuffer;

        destroy(object: object): void;
        getPreloadedPackage(remotePackageName: string, remotePackageSize: number): ArrayBuffer;
        instantiateWasm
        (
            imports: WebAssemblyImports,
            successCallback: (module: IWebAssemblyMemoryMemory) => void,
        )
            : WebAssemblyExports;
        locateFile(url: string, scriptDirectory: string): string;

        // USE_TYPED_ARRAYS == 1
        HEAP: Int32Array;
        IHEAP: Int32Array;
        FHEAP: Float64Array;

        // USE_TYPED_ARRAYS == 2
        HEAP8: Int8Array;
        HEAP16: Int16Array;
        HEAP32: Int32Array;
        HEAPU8: Uint8Array;
        HEAPU16: Uint16Array;
        HEAPU32: Uint32Array;
        HEAPF32: Float32Array;
        HEAPF64: Float64Array;

        TOTAL_STACK: number;
        TOTAL_MEMORY: number;
        FAST_MEMORY: number;

        addOnPreRun(cb: () => any): void;
        addOnInit(cb: () => any): void;
        addOnPreMain(cb: () => any): void;
        addOnExit(cb: () => any): void;
        addOnPostRun(cb: () => any): void;
        quit(status: number, error: unknown): void;

        ASAN_OPTIONS?: string;
    }

    /**
     * @public
     */
    export type EmscriptenModuleFactory<T extends object> = (moduleOverrides?: Partial<T & EmscriptenModule>) => Promise<EmscriptenModule & T>;
}
