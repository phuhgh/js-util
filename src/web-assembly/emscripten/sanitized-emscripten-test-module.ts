import { Emscripten } from "../../external/emscripten.js";
import { getWasmTestMemory } from "../util/get-wasm-test-memory.js";
import { EmscriptenWrapperOptions, getEmscriptenWrapper } from "./get-emscripten-wrapper.js";
import { _Fp } from "../../fp/_fp.js";
import { IEmscriptenWrapper } from "./i-emscripten-wrapper.js";
import { IDebugBindings } from "./i-debug-bindings.js";
import { _Production } from "../../production/_production.js";
import { Test_resetLifeCycle } from "../../test-util/test_reset-life-cycle.js";
import { _Debug } from "../../debug/_debug.js";
import type { IJsUtilBindings } from "../i-js-util-bindings.js";
import { ReferenceCountedStrategy } from "./reference-counted-strategy.js";
import { StableIdStore } from "../../runtime/rtti-interop.js";

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
        startsWith: ["==42==WARNING: AddressSanitizer failed to allocate 0xfffffff"],
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
export class SanitizedEmscriptenTestModule<TEmscriptenBindings extends IJsUtilBindings, TWrapperExtensions extends object>
{
    public constructor
    (
        private readonly testModule: Emscripten.EmscriptenModuleFactory<TEmscriptenBindings>,
        private readonly options: ISanitizedTestModuleOptions,
        private readonly extension?: TWrapperExtensions,
    )
    {
        this.state.currentDisabledErrors = this.options.disabledErrors || {};
    }

    public async initialize(): Promise<void>
    {
        Test_resetLifeCycle();
        this.state.loggedErrors.length = 0;

        const memory = getWasmTestMemory({
            initial: this.options.initialMemoryPages,
            maximum: this.options.maxMemoryPages,
            shared: this.options.shared,
        });

        const options = this.options;
        const state = this.state;
        // avoid referencing `this` in closures, it prevents the test module from being gc'd in debug builds
        this._wrapper = await getEmscriptenWrapper(
            memory,
            this.testModule, new ReferenceCountedStrategy(),
            new EmscriptenWrapperOptions<IJsUtilBindings>([]),
            {
                ASAN_OPTIONS: "allocator_may_return_null=1",
                print: _Fp.noOp,
                printErr: (error: string) =>
                {
                    if (isErrorExcluded(state.currentDisabledErrors, error))
                    {
                        _Debug.verboseLog(["WASM"], "Ignoring logged error by exclusion:\n" + error);
                        return;
                    }

                    state.loggedErrors.push(error);
                    _Debug.logError(error);
                },
                // legacy handler (this doesn't appear to be used anymore...)
                quit: () =>
                {
                    // emscripten hits asserts if quit doesn't interrupt execution
                    // the default behavior in node is to kill the process which would kill the tests
                    // by throwing something unique we can catch but avoid swallowing actual errors
                    throw options.quitThrowsWith;
                },
                onExit: (statusCode: number): void =>
                {
                    // noinspection SuspiciousTypeOfGuard - we want to know if they change the API
                    if (typeof statusCode !== "number")
                    {
                        throw _Production.createError("Unsupported emscripten version, expected to get a status code...");
                    }
                    if (statusCode === 0)
                    {
                        // we could just use their object, but for simplicity we normalize to "the old way"
                        throw options.quitThrowsWith;
                    }

                    // there's a non-zero status code, emscripten is pretty good at reporting this, so let them do it...
                },
                ...this.extension,
            } as object as TEmscriptenBindings
        ) as IEmscriptenWrapper<TEmscriptenBindings & TWrapperExtensions & IDebugBindings, ReferenceCountedStrategy>;

        // -sEXIT_RUNTIME=1 does not play well with threads + no main, manually keep the runtime alive
        this.wrapper.instance.runtimeKeepalivePush();
    }

    public get wrapper(): IEmscriptenWrapper<TEmscriptenBindings & TWrapperExtensions & IDebugBindings, ReferenceCountedStrategy>
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
    public endEmscriptenProgram(errorLoggingAllowed: boolean = false): void
    {
        const idStore = this.wrapper.interopIds as StableIdStore;
        if (idStore.idBuffer != null)
        {
            this.wrapper.rootNode.getLinked().unlink(idStore.idBuffer.resourceHandle);
        }

        this.runWithDisabledErrors(
            { ...this.state.currentDisabledErrors, ...this.options.disabledShutdownErrors },
            () =>
            {
                // kick off asan checks
                try
                {
                    this.wrapper.instance.runtimeKeepalivePop();
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

        if (this.state.loggedErrors.length > 0 && !errorLoggingAllowed)
        {
            const messages = ["The C++ logged an error to the console, this is considered a failure.", "Reprinting errors:"].concat(this.state.loggedErrors);
            throw _Production.createError(messages.join("\n"));
        }

        this.wrapper.rootNode.getLinked().unlinkAll();
    }

    public runWithDisabledErrors(exclusions: IErrorExclusions, callback: () => void): void
    {
        const original = this.state.currentDisabledErrors;
        this.state.currentDisabledErrors = { ...this.state.currentDisabledErrors, ...exclusions };
        callback();
        this.state.currentDisabledErrors = original;
    }

    private _wrapper: IEmscriptenWrapper<TEmscriptenBindings & TWrapperExtensions & IDebugBindings, ReferenceCountedStrategy> | undefined;
    private readonly state = {
        currentDisabledErrors: {} as IErrorExclusions,
        loggedErrors: new Array<string>(),
    };
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