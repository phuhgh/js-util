import { Emscripten } from "../../external/emscripten.js";
import { getWasmTestMemory } from "../util/get-wasm-test-memory.js";
import { getEmscriptenWrapper } from "./get-emscripten-wrapper.js";
import { _Fp } from "../../fp/_fp.js";
import { IEmscriptenWrapper } from "./i-emscripten-wrapper.js";
import { IDebugBindings } from "./i-debug-bindings.js";
import { _Production } from "../../production/_production.js";

/**
 * @public
 */
export interface ISanitizedTestModuleOptions
{
    disabledErrors: Set<string>;
    /**
     * 64 kb per page
     */
    initialMemoryPages: number;
    /**
     * 64 kb per page
     */
    maxMemoryPages?: number;
    quitThrowsWith: object;
}

/**
 * @public
 */
export const emscriptenAsanTestModuleOptions: ISanitizedTestModuleOptions = {
    disabledErrors: new Set<string>(["==42==WARNING: AddressSanitizer failed to allocate 0xfffffffc bytes"]),
    initialMemoryPages: 8192,
    maxMemoryPages: 8192,
    quitThrowsWith: {},
};

/**
 * @public
 */
export const emscriptenSafeHeapTestModuleOptions: ISanitizedTestModuleOptions = {
    disabledErrors: new Set<string>(),
    initialMemoryPages: 128,
    maxMemoryPages: 512,
    quitThrowsWith: {},
};

/**
 * @public
 */
export class SanitizedEmscriptenTestModule<T extends object, U extends object>
{
    public constructor
    (
        private readonly testModule: Emscripten.EmscriptenModuleFactory<T>,
        private readonly options: ISanitizedTestModuleOptions,
        private readonly extension?: U,
    )
    {
    }

    public async initialize(): Promise<void>
    {
        const memory = getWasmTestMemory({ initial: this.options.initialMemoryPages, maximum: this.options.maxMemoryPages });

        this._wrapper = await getEmscriptenWrapper(memory, this.testModule, {
            ASAN_OPTIONS: "allocator_may_return_null=1",
            print: _Fp.noOp,
            printErr: (error: string) =>
            {
                // looks like asan writes to stderr regardless of option...
                if (this.options.disabledErrors.has(error))
                {
                    return;
                }

                throw new Error(error);
            },
            quit: () =>
            {
                // emscripten hits asserts if quit doesn't interrupt execution
                // the default behavior in node is to kill the process which would kill the tests
                // by throwing something unique we can catch but avoid swallowing actual errors
                throw this.options.quitThrowsWith;
            },
            ...this.extension,
        } as T) as IEmscriptenWrapper<T & U & IDebugBindings>;
    }

    public get wrapper(): IEmscriptenWrapper<T & U & IDebugBindings>
    {
        if (this._wrapper == null)
        {
            throw _Production.createError("initialize must be called first");
        }

        return this._wrapper;
    }


    /**
     * NB you MUST set the flag `-s EXIT_RUNTIME=1` for this to work.
     */
    public endEmscriptenProgram(): void
    {
        // kick off asan checks
        try
        {
            this.wrapper.instance._jsUtilEndProgram(0);
        }
        catch (error)
        {
            if (error !== emscriptenAsanTestModuleOptions.quitThrowsWith)
            {
                throw error;
            }
        }
    }

    /**
     * Call this before each test case.
     */
    public reset(): void
    {
        if (this._wrapper)
        {
            this._wrapper.debug.uniquePointers.clear();
        }
    }

    private _wrapper: IEmscriptenWrapper<T & U & IDebugBindings> | undefined;
}
