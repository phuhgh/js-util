import { Emscripten } from "../../../external/emscripten";
import { geWasmTestMemory } from "../get-wasm-test-memory";
import { getEmscriptenWrapper } from "./get-emscripten-wrapper";
import { _Fp } from "../../fp/_fp";
import { IEmscriptenWrapper } from "./i-emscripten-wrapper";
import { _Debug } from "../../debug/_debug";

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

export const emscriptenAsanTestModuleOptions: ISanitizedTestModuleOptions = {
    disabledErrors: new Set<string>(["==42==WARNING: AddressSanitizer failed to allocate 0xfffffffc bytes"]),
    initialMemoryPages: 8192,
    maxMemoryPages: 8192,
    quitThrowsWith: {},
};

export const emscriptenSafeStackTestModuleOptions: ISanitizedTestModuleOptions = {
    disabledErrors: new Set<string>(),
    initialMemoryPages: 128,
    maxMemoryPages: 512,
    quitThrowsWith: {},
};

export class SanitizedEmscriptenTestModule<T extends Emscripten.EmscriptenModule>
{
    public constructor
    (
        private readonly testModule: Emscripten.EmscriptenModuleFactory,
        private readonly options: ISanitizedTestModuleOptions,
        private readonly extension?: Partial<T>,
    )
    {
    }

    public async initialize(): Promise<void>
    {
        const asanTestMemory = { initial: this.options.initialMemoryPages, maximum: this.options.maxMemoryPages };
        const memory = geWasmTestMemory(asanTestMemory);

        this._wrapper = await getEmscriptenWrapper(memory, this.testModule, {
            ASAN_OPTIONS: "allocator_may_return_null=1",
            print: _Fp.noOp,
            printErr: (error) =>
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
        });
    }

    public get wrapper(): IEmscriptenWrapper
    {
        DEBUG_MODE && _Debug.assert(this._wrapper != null, "initialize must be called first");
        return this._wrapper;
    }

    public endEmscriptenProgram(): void
    {
        // kick off asan checks
        try
        {
            this.wrapper.instance._endProgram(0);
        }
        catch (error)
        {
            if (error !== emscriptenAsanTestModuleOptions.quitThrowsWith)
            {
                throw error;
            }
        }
    }

    private _wrapper!: IEmscriptenWrapper;
}
