import { DiModule } from "./di-module.js";
import { InjectableError } from "./injectable-error.js";
import type { IContextlessFn } from "../../typescript/i-contextless-function.js";
import { _Debug } from "../../debug/_debug.js";
import { arrayEmptyArray } from "../../array/impl/array-empty-array.js";

// todo jack14: the objective here is utility for all users, templated and regular, use should be optional outside of templates
// todo jack: check compatability with Angular AOT compiler

/**
 * @public
 * Used to uniquely identify a resolvable injector, given a {@link DiModule}.
 */
export class InjectorToken
{
    public constructor
    (
        /**
         * Used for debugging purposes (error messages, object identification). Does not affect resolution behavior.
         */
        public readonly name: string,
    )
    {
    }
}

/**
 * @public
 * The base interface for all kinds of injectables, used in conjunction with a {@link DiModule} to resolve modules in a consistent way.
 * See the implementations for additional ways to configure and resolve dependencies.
 */
export interface IInjectable<TValue>
{
    readonly token: InjectorToken;
    // todo jack: make it less verbose?
    resolveValue(module: DiModule): TValue;
}

/**
 * @public
 * todo jack: docs
 * usage notes:
 * - Dependencies should always point to the "base" implementation, where an override is required you should test for
 * that instance being present and throw if not. Overrides should always be be done on the module.
 *
 * todo jack: potential boo boo: the order of overrides does actually matter, maybe add system for sanitizing?
 *   at the very least letting you know there is a problem in debug mode
 */
export class Injectable<TValue, TDeps extends TUnknownInjectables>
    implements IInjectable<TValue>
{
    public constructor
    (
        public readonly token: InjectorToken,
        public readonly dependencies: TDeps,
        /**
         * Given the resolved dependencies, create the value.
         */
        public readonly createOne: IContextlessFn<TUnwrapDependencies<NoInfer<TDeps>>, TValue>,
    )
    {
        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            _Debug.assert(this.dependencies.every((i) => (i != null)), "expected all deps to be defined...");
        });
    }

    public resolveValue(module: DiModule): TValue
    {
        // check if injectable module already has a value
        let value = module.retrieveValue<TValue>(this.token);
        if (value !== undefined)
        {
            return value;
        }

        // check if this injectable has been overridden
        const override = module.resolveInjectable<TValue>(this);
        if (override != this)
        {
            return override.resolveValue(module);
        }

        try
        {
            // no existing value, try to create it and store it on the module
            const resolvedDeps = this.resolveDependencies(module);

            value = (this.createOne.apply as (thisArg: null, deps: TUnwrapDependencies<TDeps>) => TValue)(null, resolvedDeps);
            module.storeValue(this.token, value);
            return value;
        }
        catch (error)
        {
            throw InjectableError.extendContext(this.token.name, error);
        }
    }

    private resolveDependencies
    (
        module: DiModule,
    )
        : TUnwrapDependencies<TDeps>
    {
        const dependencies = this.dependencies;
        const mapped = new Array(dependencies.length);

        for (let i = 0, iEnd = dependencies.length; i < iEnd; ++i)
        {
            mapped[i] = dependencies[i].resolveValue(module);
        }

        return mapped as unknown as TUnwrapDependencies<TDeps>;
    }
}

/**
 * @public
 * todo jack: docs
 */
export class InlineInjectable<TValue, TDeps extends TUnknownInjectables = []>
    extends Injectable<TValue, TDeps>
{
    public constructor
    (
        name: string,
        dependencies: TDeps,
        createOne: IContextlessFn<TUnwrapDependencies<TDeps>, TValue>,
    )
    {
        super(new InjectorToken(name), dependencies, createOne);
    }
}

/**
 * @public
 * todo jack: docs, naming is rubs (error message is wrong too, sometimes you need to supply overrides by factory)
 */
export class UnimplementedInjectable<TValue>
    extends Injectable<TValue, readonly []>
{
    public constructor
    (
        injectableName: string,
    )
    {
        super(
            new InjectorToken(injectableName),
            arrayEmptyArray,
            (): never =>
            {
                throw new Error(`Required injectable "${injectableName}" was not provided, you must provide an override on the module.`);
            },
        );
    }
}

/**
 * @public
 * todo jack: docs
 */
export class ValueInjectable<TValue>
    implements IInjectable<TValue>
{
    // todo jack: this is possibly surplus to requirements now
    /**
     * @summary Creates a new injectable, that can be used to override the original.
     * @remark The new value need only be compatible with the original value.
     */
    static createOverride<T, U extends T>(original: IInjectable<T>, newValue: U): ValueInjectable<U>
    {
        return new ValueInjectable<U>(newValue, original.token);
    }

    public readonly token: InjectorToken;

    public constructor
    (
        value: TValue,
        token: InjectorToken = new InjectorToken("ANONYMOUS_VALUE_INJECTABLE"),
    )
    {
        this.token = token;
        this.value = value;
    }

    public resolveValue(module: DiModule): TValue
    {
        const override = module.resolveInjectable(this);

        if (override != this)
        {
            return override.resolveValue(module);
        }
        else
        {
            return this.value;
        }
    }

    private readonly value: TValue;
}

/**
 * @public
 * A list of unknown {@link IInjectable}'s.
 */
export type TUnknownInjectables = readonly IInjectable<unknown>[];

/**
 * @public
 */
export type TUnwrapDependencies<T extends TUnknownInjectables> =
    T extends readonly [IInjectable<infer D1>]
        ? readonly [D1]
        : T extends readonly [IInjectable<infer D1>, IInjectable<infer D2>]
            ? readonly [D1, D2]
            : T extends readonly [IInjectable<infer D1>, IInjectable<infer D2>, IInjectable<infer D3>]
                ? readonly [D1, D2, D3]
                : T extends readonly [IInjectable<infer D1>, IInjectable<infer D2>, IInjectable<infer D3>, IInjectable<infer D4>]
                    ? readonly [D1, D2, D3, D4]
                    : T extends readonly [IInjectable<infer D1>, IInjectable<infer D2>, IInjectable<infer D3>, IInjectable<infer D4>, IInjectable<infer D5>]
                        ? readonly [D1, D2, D3, D4, D5]
                        : T extends readonly [IInjectable<infer D1>, IInjectable<infer D2>, IInjectable<infer D3>, IInjectable<infer D4>, IInjectable<infer D5>, IInjectable<infer D6>]
                            ? readonly [D1, D2, D3, D4, D5, D6]
                            : T extends readonly [IInjectable<infer D1>, IInjectable<infer D2>, IInjectable<infer D3>, IInjectable<infer D4>, IInjectable<infer D5>, IInjectable<infer D6>, IInjectable<infer D7>]
                                ? readonly [D1, D2, D3, D4, D5, D6, D7]
                                : T extends readonly [IInjectable<infer D1>, IInjectable<infer D2>, IInjectable<infer D3>, IInjectable<infer D4>, IInjectable<infer D5>, IInjectable<infer D6>, IInjectable<infer D7>, IInjectable<infer D8>]
                                    ? readonly [D1, D2, D3, D4, D5, D6, D7, D8]
                                    : never
