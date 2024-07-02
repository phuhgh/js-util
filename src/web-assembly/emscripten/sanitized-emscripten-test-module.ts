import { Emscripten } from "../../external/emscripten.js";
import { getWasmTestMemory } from "../util/get-wasm-test-memory.js";
import { getEmscriptenWrapper } from "./get-emscripten-wrapper.js";
import { _Fp } from "../../fp/_fp.js";
import { IEmscriptenWrapper } from "./i-emscripten-wrapper.js";
import { IDebugBindings } from "./i-debug-bindings.js";
import { _Production } from "../../production/_production.js";
import { Test_resetLifeCycle } from "../../test-util/test_reset-life-cycle.js";
import { _Debug } from "../../debug/_debug.js";

/**
 * @public
 * Options for {@link SanitizedEmscriptenTestModule}.
 */
export interface ISanitizedTestModuleOptions
{
    shared: boolean;
    /**
     * Errors which are always ignored.
     */
    disabledErrors?: IErrorExclusions;
    /**
     * Errors which are ignored during std::exit.
     */
    disabledShutdownErrors?: IErrorExclusions;
    /**
     * 64 kb per page.
     */
    initialMemoryPages: number;
    /**
     * 64 kb per page
     */
    maxMemoryPages: number;
    quitThrowsWith: object;
}

/**
 * @public
 * Errors which should be ignored in tests.
 */
export interface IErrorExclusions
{
    readonly startsWith?: readonly string[];
    readonly exactMatch?: readonly string[];
}

const emscriptenTestModuleOptions: ISanitizedTestModuleOptions = {
    disabledErrors: {
        // looks like asan writes to stderr regardless of option...
        exactMatch: ["==42==WARNING: AddressSanitizer failed to allocate 0xfffffffc bytes"],
    },
    initialMemoryPages: 128,
    maxMemoryPages: 8192,
    quitThrowsWith: {},
    shared: false,
};

/**
 * @public
 * Provides "sensible" options for a {@link SanitizedEmscriptenTestModule}.
 */
export function getEmscriptenTestModuleOptions(
    overrides?: Partial<ISanitizedTestModuleOptions>,
)
    : ISanitizedTestModuleOptions
{
    return { ...emscriptenTestModuleOptions, ...overrides };
}

/**
 * @public
 * A wrapper for running emscripten modules built with ASAN. To see the full report, you must call `endEmscriptenProgram`.
 * @typeParam TEmscriptenBindings - The generated WASM bindings.
 * @typeParam TWrapperExtensions - Extensions to the test wrapper itself, i.e. overwrite the module with test specific logic.
 */
export class SanitizedEmscriptenTestModule<TEmscriptenBindings extends object, TWrapperExtensions extends object>
{
    public constructor
    (
        private readonly testModule: Emscripten.EmscriptenModuleFactory<TEmscriptenBindings>,
        private readonly options: ISanitizedTestModuleOptions,
        private readonly extension?: TWrapperExtensions,
    )
    {
        this.currentDisabledErrors = this.options.disabledErrors || {};
    }

    public async initialize(): Promise<void>
    {
        const memory = getWasmTestMemory({
            initial: this.options.initialMemoryPages,
            maximum: this.options.maxMemoryPages,
            shared: this.options.shared,
        });

        this._wrapper = await getEmscriptenWrapper(memory, this.testModule, {
            ASAN_OPTIONS: "allocator_may_return_null=1",
            print: _Fp.noOp,
            printErr: (error: string) =>
            {
                if (isErrorExcluded(this.currentDisabledErrors, error))
                {
                    _Debug.verboseLog(["WASM"], "Ignoring logged error by exclusion:\n" + error);
                    return;
                }

                this.errorLogged = true;
                _Debug.logError(error);
            },
            quit: () =>
            {
                // emscripten hits asserts if quit doesn't interrupt execution
                // the default behavior in node is to kill the process which would kill the tests
                // by throwing something unique we can catch but avoid swallowing actual errors
                throw this.options.quitThrowsWith;
            },
            ...this.extension,
        } as TEmscriptenBindings) as IEmscriptenWrapper<TEmscriptenBindings & TWrapperExtensions & IDebugBindings>;

        // -sEXIT_RUNTIME=1 does not play well with threads + no main, manually keep the runtime alive
        this.wrapper.instance.runtimeKeepalivePush!();
    }

    public get wrapper(): IEmscriptenWrapper<TEmscriptenBindings & TWrapperExtensions & IDebugBindings>
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
        this.runWithDisabledErrors(
            { ...this.currentDisabledErrors, ...this.options.disabledShutdownErrors },
            () =>
            {
                // kick off asan checks
                try
                {
                    this.wrapper.instance.runtimeKeepalivePop!();
                    this.wrapper.instance._jsUtilEndProgram(0);
                }
                catch (error)
                {
                    if (error !== emscriptenTestModuleOptions.quitThrowsWith)
                    {
                        throw error;
                    }
                }
            },
        );

        if (this.errorLogged)
        {
            throw _Production.createError("The C++ logged an error to the console, this is considered a failure.");
        }
    }

    public runWithDisabledErrors(exclusions: IErrorExclusions, callback: () => void): void
    {
        const original = this.currentDisabledErrors;
        this.currentDisabledErrors = { ...this.currentDisabledErrors, ...exclusions };
        callback();
        this.currentDisabledErrors = original;
    }

    /**
     * Call this before each test case.
     */
    public reset(errorLoggingAllowed: boolean = false): void
    {
        Test_resetLifeCycle();

        if (this._wrapper)
        {
            this._wrapper.debug.uniquePointers.clear();
        }

        if (errorLoggingAllowed)
        {
            this.errorLogged = false;
        }
        else if (this.errorLogged)
        {
            throw _Production.createError("The C++ logged an error to the console, this is considered a failure.");
        }
    }

    private _wrapper: IEmscriptenWrapper<TEmscriptenBindings & TWrapperExtensions & IDebugBindings> | undefined;
    private currentDisabledErrors: IErrorExclusions;
    private errorLogged: boolean = false;
}

function isErrorExcluded(disabledErrors: IErrorExclusions, error: string)
{
    let excluded = false;

    if (disabledErrors.exactMatch)
    {
        excluded = disabledErrors.exactMatch.some(x => x === error);
    }
    if (!excluded && disabledErrors.startsWith)
    {
        excluded = disabledErrors.startsWith.some(x => error.startsWith(x));
    }

    return excluded;
}