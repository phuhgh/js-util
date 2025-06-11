import { IInjectable, Injectable, InjectorToken, ValueInjectable } from "./injectables.js";
import { DiModule } from "./di-module.js";
import { _Debug } from "../../debug/_debug.js";
import type { IUpdateableOptions } from "./option-updater.js";
import type { IContextlessFn } from "../../typescript/i-contextless-function.js";
import { arrayMap } from "../../array/impl/array-map.js";
import type { TEntityGroupValidator, TLinkableGroup, TSubsetEntityGroup, TSupersetEntityGroup } from "../impl/entity-group.js";
import type { IEntityGroup } from "../entity-group-core-model.js";
import type { TProperty } from "../../typescript/t-property.js";
import { fpIdentity } from "../../fp/impl/fp-identity.js";

// todo jack13: sanitize, naming etc
// todo jack13: it's possibly too much to ask of an end user, but changeIds would make this more performant
// todo jack13: maybe we could provide a utility for bumping version numbers and create the change for them (factory pattern?)
//              that would allow us to create a change descriptor and just read it out


// todo jack: poor naming, play thing
export interface ITemplated<TValue>
{
    readonly id: TId;
    resolveValue(context: TemplateContext): TValue;
    // todo jack: sus?
    updateValue(context: TemplateContext, value: TValue): void;
}

/**
 * @public
 * todo jack: docs
 */
export type TId = string | number | symbol;

// todo jack14: have this take options, use interface for options that is common, infer that it can be applied
/**
 * @public
 * todo jack: docs, the naming is very wrong
 */
export class TemplateContext
{
    public module = new DiModule();

    public getValue<T>(id: TId): T | null
    {
        const value = this.resolved.get(id);
        return value == null ? null : value as T;
    }

    // todo jack: this taking values looks redundant now
    public setValue(id: TId, value: unknown, options: unknown): void
    {
        _BUILD.DEBUG && _Debug.assert(!this.resolved.has(id), "unset if overwrite is desired");
        this.resolved.set(id, value);
        this.resolved.set(id, options);
    }

    // todo jack: do we really need the bool now?
    public setOptions(id: TId, options: unknown): boolean
    {
        // todo jack: wording
        _BUILD.DEBUG && _Debug.assert(this.resolved.has(id), "set must be called first");
        const existing = this.options.get(id);

        if (existing === options)
        {
            return false;
        }
        else
        {
            this.options.set(id, options);
            return true;
        }
    }

    public unset(id: TId)
    {
        this.resolved.delete(id);
        this.options.delete(id);
    }

    private readonly resolved = new Map<TId, unknown>();
    private readonly options = new Map<TId, unknown>();
}

/**
 * @public
 * todo jack: docs
 */
export class TemplateValue<TValue, TOptions = TValue extends IUpdateableOptions<infer TOptions> ? TOptions : null>
    implements ITemplated<TValue>
{
    public constructor
    (
        public readonly id: TId,
        protected readonly createValue: (context: TemplateContext, options: TOptions) => TValue,
        public readonly options: TOptions,
    )
    {
    }

    // from ITemplated
    public resolveValue(context: TemplateContext): TValue
    {
        const existingValue = context.getValue<TValue>(this.id);

        if (existingValue != null)
        {
            return existingValue;
        }

        const value = this.createValue(context, this.options);
        context.setValue(this.id, value, this.options);
        return value;
    }

    // from ITemplated
    public updateValue(context: TemplateContext, value: TValue): void
    {
        // i.e. the options have not been applied before
        const unseenOptions = context.setOptions(this.id, this.options);

        if (unseenOptions && this.options != null)
        {
            (value as IUpdateableOptions<object>).options.updateOptions(this.options);
        }
    }
}

// todo jack15: what we really want is, given the injection token, "do the right thing"...
/**
 * @public
 * todo jack: docs
 */
export class TemplateInjectable<TValue, TOptions = TValue extends IUpdateableOptions<infer TOptions> ? TOptions : undefined>
    extends TemplateValue<IInjectable<TValue>, TOptions>
    implements ITemplated<IInjectable<TValue>>
{
    public static fromValue<TValue>
    (
        id: TId,
        value: TValue,
        options: TValue extends IUpdateableOptions<infer TOptions> ? TOptions : undefined,
    )
        : TemplateInjectable<TValue>
    {
        return new TemplateInjectable(
            id,
            () => new ValueInjectable(value, new InjectorToken(id.toString())),
            options,
        );
    }

    // todo jack: naming, docs (name is token), create once (no options...)
    public static createStatic<TDeps extends TUnknownTemplateInjectables, TValue>
    (
        token: InjectorToken,
        deps: TDeps,
        factory: IContextlessFn<TUnwrapTemplateDependencies<TDeps>, TValue>,
    )
        : TemplateInjectable<TValue, undefined>
    {
        return new TemplateInjectable(
            token.name,
            (context) =>
            {
                const proxiedDeps = arrayMap(deps, (dep) => dep.resolveValue(context));
                return new Injectable(token, proxiedDeps, factory);
            },
            undefined,
        );
    }

    // todo jack: naming, it's the one with options
    public static createDynamic<TDeps extends TUnknownTemplateInjectables, TValue extends IUpdateableOptions<TOptions>, TOptions extends object>
    (
        token: InjectorToken,
        deps: TDeps,
        factory: IContextlessFn<[NoInfer<TOptions>, ...TUnwrapTemplateDependencies<NoInfer<TDeps>>], TValue>,
        initialOptions: TOptions,
    )
        : TemplateInjectable<TValue, TOptions>
    {
        return new TemplateInjectable(
            token.name,
            (context) =>
            {
                const proxiedDeps = arrayMap(deps, (dep) => dep.resolveValue(context));
                return new Injectable(token, proxiedDeps, (...unwrappedDeps) => factory(initialOptions, ...unwrappedDeps));
            },
            initialOptions,
        );
    }

    // todo jack: this can be private probably
    public constructor
    (
        id: TId,
        createValue: (context: TemplateContext, options: TOptions) => IInjectable<TValue>,
        initialOptions: TOptions,
    )
    {
        super(id, createValue, initialOptions);
    }

    // from ITemplated
    public override updateValue(context: TemplateContext, injectable: IInjectable<TValue>): void
    {
        // i.e. the options have not been applied before
        const unseenOptions = context.setOptions(this.id, this.options);

        if (unseenOptions && this.options != null)
        {
            const value = injectable.resolveValue(context.module);
            (value as IUpdateableOptions<object>).options.updateOptions(this.options);
        }
    }

    public resolve(context: TemplateContext): TValue
    {
        return this.resolveValue(context).resolveValue(context.module);
    }
}

// todo jack16
/**
 * @public
 * todo jack docs
 */
export type TUnknownTemplateInjectables = readonly ITemplated<IInjectable<unknown>>[];
/**
 * @public
 * todo jack; try using mapped tuple types
 */
export type TUnwrapTemplateDependencies<T extends TUnknownTemplateInjectables> =
    T extends readonly [ITemplated<IInjectable<infer D1>>]
        ? readonly [D1]
        : T extends readonly [ITemplated<IInjectable<infer D1>>, ITemplated<IInjectable<infer D2>>]
            ? readonly [D1, D2]
            : T extends readonly [ITemplated<IInjectable<infer D1>>, ITemplated<IInjectable<infer D2>>, ITemplated<IInjectable<infer D3>>]
                ? readonly [D1, D2, D3]
                : T extends readonly [ITemplated<IInjectable<infer D1>>, ITemplated<IInjectable<infer D2>>, ITemplated<IInjectable<infer D3>>, ITemplated<IInjectable<infer D4>>]
                    ? readonly [D1, D2, D3, D4]
                    : T extends readonly [ITemplated<IInjectable<infer D1>>, ITemplated<IInjectable<infer D2>>, ITemplated<IInjectable<infer D3>>, ITemplated<IInjectable<infer D4>>, ITemplated<IInjectable<infer D5>>]
                        ? readonly [D1, D2, D3, D4, D5]
                        : T extends readonly [ITemplated<IInjectable<infer D1>>, ITemplated<IInjectable<infer D2>>, ITemplated<IInjectable<infer D3>>, ITemplated<IInjectable<infer D4>>, ITemplated<IInjectable<infer D5>>, ITemplated<IInjectable<infer D6>>]
                            ? readonly [D1, D2, D3, D4, D5, D6]
                            : T extends readonly [ITemplated<IInjectable<infer D1>>, ITemplated<IInjectable<infer D2>>, ITemplated<IInjectable<infer D3>>, ITemplated<IInjectable<infer D4>>, ITemplated<IInjectable<infer D5>>, ITemplated<IInjectable<infer D6>>, ITemplated<IInjectable<infer D7>>]
                                ? readonly [D1, D2, D3, D4, D5, D6, D7]
                                : T extends readonly [ITemplated<IInjectable<infer D1>>, ITemplated<IInjectable<infer D2>>, ITemplated<IInjectable<infer D3>>, ITemplated<IInjectable<infer D4>>, ITemplated<IInjectable<infer D5>>, ITemplated<IInjectable<infer D6>>, ITemplated<IInjectable<infer D7>>, ITemplated<IInjectable<infer D8>>]
                                    ? readonly [D1, D2, D3, D4, D5, D6, D7, D8]
                                    : never

/**
 * @public
 * todo jack: docs
 */
export class EntityRef<TTrait>
{
    public constructor
    (
        public readonly id: TId,
        public readonly createEntity: (context: TemplateContext) => TTrait,
    )
    {
    }
}

// todo jack16: on the subject on entity specifications:
// any dependency on a template will make the specification also become a template, i.e. we can't get the entity unless we go via context...
// could this be resolved if we gave context to chart?
// maybe, but it would be required in factories etc, as the dependency tree goes most specific to least specific
// the real question in such cases is, how would we know it's safe to resolve?
// the magic go function?
// the DI module doesn't understand hierarchy, so it can't really resolve objects by itself, the act of asking for specific value resolution creates the dependency tree
// (this is consistent with many other DI systems...)
// the way e.g. Angular does it is via a root component which brings in "stuff"
// todo jack16: entity ref is probably better done by a trait, really we just want a spot the user can dump data (and replace the object), without replacing the entity object
// todo jack: though... does useMemo have an ordering requirement?
// the real thing the user needs is for context unwrapping...
// a complexity is you can technically share entities between plots
// -> runtime resolution is the only way to handle this (but that has a cost, so... we don't want this as the default, or at all)
// -> FACTORY FACTORY!... create factories with the context already there... though this is only useful with deferred creation
// i.e. once all declarations have happened
/**
 const kindOfEntity1 = [
 {
 id: generateId(...params),
 options: {},
 config: {},
 createEntity: (options, config, context) => do stuffTM,
 update-scheduling entity: (options, entity, context) => { entity.options = options }, // default?
 }
 ]
 */

// allows sharing of options / config

/**
 * @public
 * todo jack: docs
 */
export class EntityGroupLinkTemplate<TOptions, TTrait>
{
    public static createOne<TOptions, TTrait>
    (
        id: TId,
        fromGroup: ITemplated<IInjectable<TLinkableGroup<NoInfer<TOptions>, unknown, NoInfer<TTrait>>>>,
        toGroups: readonly ITemplated<IInjectable<TLinkableGroup<TOptions, unknown, TTrait>>>[],
    )
        : EntityGroupLinkTemplate<TOptions, TTrait>
    {
        return new EntityGroupLinkTemplate(id, fromGroup, toGroups);
    }

    private constructor
    (
        public readonly id: TId,
        public readonly fromGroup: ITemplated<IInjectable<TLinkableGroup<TOptions, unknown, TTrait>>>,
        public readonly toGroup: readonly ITemplated<IInjectable<TLinkableGroup<TOptions, unknown, TTrait>>>[],
    )
    {
    }
}

// todo jack
// export function DeclarativeChartComponent<TRenderer extends TUnknownRenderer>
// (
//     _chart: IChartSpecification<TRenderer>,
// )
//     : void
// {
//     // todo jack
// }

// export interface IChartSpecification<TRenderer extends TUnknownRenderer>
// {
//     readonly chart: ITemplated<IInjectable<IChartComponent<TRenderer>>>;
//     readonly updateGroup: IGroupMembersSpecification<IUpdateGroup<NoInfer<TRenderer>>>;
//     readonly plots: readonly IPlotSpecification<IPlotRange>[];
//     // todo jack: dev ux - really we want this on plot too
//     readonly groupRelations?: readonly EntityGroupLinkTemplate<unknown, unknown>[];
// }
//
// export interface IPlotSpecification<TPlotRange extends IPlotRange>
// {
//     readonly plot: ITemplated<IInjectable<IPlot<TPlotRange, unknown>>>;
//     readonly groups: readonly IGroupSpecification<IEntityGroup<unknown, unknown>>[];
//     readonly groupRelations?: readonly EntityGroupLinkTemplate<unknown, unknown>[];
// }

export interface IGroupMembersSpecification<TGroup extends IEntityGroup<unknown, unknown>>
{
    readonly entityMembers: readonly(
        TGroup extends TSubsetEntityGroup<infer TOpts, unknown, infer TTrait> ?
            ISubsetGroupEntities<TOpts, TTrait>
            : TGroup extends TSupersetEntityGroup<infer TOpts, unknown, infer TTrait>
                ? ISupersetGroupEntities<TOpts, TTrait>
                : never
        )[];
}

export interface IGroupSpecification<TGroup extends IEntityGroup<unknown, unknown>>
    extends IGroupMembersSpecification<TGroup>
{
    readonly group: ITemplated<IInjectable<TGroup>>;
}

/**
 * todo jack: game plan...
 *
 * use a builder for templatedValue / templatedInjectable that allows extensions for behaviors
 * - linking
 * - ... ?
 *
 * i.e. they can implement IRelation
 * the built object can then take relations, allows the user to specify the required dependencies, we don't need to know...
 * todo jack: this has become big enough to probably warrant moving into its own module
 */
// export class ChartDiffEngine
// {
//     public constructor
//     (
//         private readonly context = new TemplateContext(),
//     )
//     {
//     }
//
//     public onChartChange(specification: IChartSpecification<TUnknownRenderer>): void
//     {
//         applyOptions(specification.chart, this.context);
//
//         const plots = specification.plots;
//         for (let i = 0, iEnd = plots.length; i < iEnd; i++)
//         {
//             this.onPlotChange(plots[i]);
//         }
//     }
//
//     private onPlotChange(specification: IPlotSpecification<IPlotRange>): void
//     {
//         applyOptions(specification.plot, this.context);
//
//         const groups = specification.groups;
//         for (let i = 0, iEnd = groups.length; i < iEnd; i++)
//         {
//             this.onGroupChange(groups[i]);
//         }
//     }
//
//     private onGroupChange<TTrait>(specification: IGroupSpecification<IEntityGroup<unknown, unknown>>): void
//     {
//         const groupInjectable = specification.group.resolveValue(this.context);
//         // todo jack15: hax!
//         const group = groupInjectable.resolveValue({} as any);
//
//         let diffEngine = this.groupDiffEngines.get(group);
//         if (diffEngine == null)
//         {
//             diffEngine = new GroupDiffEngine<TTrait>(this.context);
//             this.groupDiffEngines.set(group, diffEngine);
//         }
//
//         diffEngine.onChange(specification);
//     }
//
//     private readonly groupDiffEngines = new WeakMap<IEntityGroup<unknown, unknown>, GroupDiffEngine<unknown>>;
// }

// todo jack
export class GroupDiffEngine<_TTrait>
{
    public constructor
    (
        private readonly context: TemplateContext,
    )
    {
    }

    public onChange(specification: IGroupSpecification<IEntityGroup<unknown, unknown>>): void
    {
        if (specification == this.previousSpecification)
        {
            // there is nothing to do
            return;
        }

        // todo jack15 - resolving twice, do actual impl
        // const group = specification.group.resolveValue(this.context);
        // group.getGroupsLinkedTo();
        this.context;
    }

    private previousSpecification: IGroupSpecification<IEntityGroup<unknown, unknown>> | null = null;
}

// todo jack: not quite right, it creates and updates... probably want to return too...
// function applyOptions(template: ITemplated<IInjectable<IUpdateableOptions<object>>>, context: TemplateContext): void
// {
//     const value = template.resolveValue(context);
//     template.updateValue(context, value);
// }

// todo jack16: definitely needs splitting up...
export type TUnknownEntityGroup = TLinkableGroup<unknown, unknown, unknown>;

export interface ISubsetGroupEntities<TEntityOptions, TTrait>
{
    createOptions(entity: TTrait): TEntityOptions;
}

// todo jack15: cleanup naming etc (create is the wrong name...)
export interface ISupersetGroupEntities<TEntityOptions, TTrait>
{
    create: (_?: TEntityOptions) => SupersetGroupEntities<TEntityOptions, TTrait>;
}

export type TMembershipsSpecification<TGroup extends IEntityGroup<unknown, unknown>>
    = TGroup extends TSubsetEntityGroup<infer TOpts, unknown, infer TTrait>
    ? ISubsetGroupEntities<TOpts, TTrait>
    : TGroup extends TSupersetEntityGroup<infer TOpts, unknown, infer TTrait>
        ? (_?: TOpts) => SupersetGroupEntities<TOpts, TTrait>
        : never;

// todo jack16: this may as well be an object or array? certainly an array could make sense (naming is probably wrong now...)
// or maybe even just bin it off... do it via an extension or something
// what you really want in the case of specifying entities is a dictionary with named entity / entity arrays
export type TEntitySpecification<TGroups extends TProperty<keyof TGroups, TUnknownEntityGroup | undefined>> =
    {
        /**
         * If the group includes `undefined` in the union, it means the group is not available, only the ability to create the options.
         */
        [K in keyof TGroups]:
        TGroups[K] extends NonNullable<TGroups[K]>
            // todo jack16: createOptions
            ? {
                readonly group: NonNullable<TGroups[K]>,
                readonly create: TMembershipsSpecification<NonNullable<TGroups[K]>>
            }
            : { readonly create: TMembershipsSpecification<NonNullable<TGroups[K]>> };
    }

export class SupersetGroupEntities<TGroupOptions, TTrait>
{
    public static createOne<TGroupOptions, TUserOptions, TTrait extends object>
    (
        createOptions: () => TUserOptions,
        _: TEntityGroupValidator<NoInfer<TUserOptions>, NoInfer<TGroupOptions>, NoInfer<TTrait>>,
        entities: readonly TTrait[],
    )
        : (_options?: TGroupOptions) => SupersetGroupEntities<NoInfer<TGroupOptions>, NoInfer<TTrait>>
    {
        return () => new SupersetGroupEntities<TGroupOptions, TTrait>(createOptions as () => object, entities);
    }

    // todo jack: horrible naming
    public static withTemplate<TGroupOptions, TUserOptions, TTrait extends object, TDeps extends TUnknownTemplateInjectables>
    (
        context: TemplateContext,
        deps: TDeps,
        createOptions: (...args: TUnwrapTemplateDependencies<TDeps>) => TUserOptions,
        _: TEntityGroupValidator<TUserOptions, TGroupOptions, TTrait>,
        entities: readonly TTrait[],
    )
        : (_options?: TGroupOptions) => SupersetGroupEntities<TGroupOptions, TTrait>
    {
        return () => new SupersetGroupEntities<TGroupOptions, TTrait>(() =>
        {
            const proxiedDeps = arrayMap(deps, (dep) => dep.resolveValue(context).resolveValue(context.module));
            return createOptions(...proxiedDeps as never as TUnwrapTemplateDependencies<TDeps>) as object;
        }, entities);
    }

    private constructor
    (
        private readonly createOptions: () => object,
        private readonly entities: readonly TTrait[],
    )
    {
    }

    public apply(group: TSupersetEntityGroup<TGroupOptions, unknown, TTrait>): void
    {
        const options = this.createOptions();
        // todo jack: optimizations
        for (const entity of this.entities)
        {
            // todo jack: use of the real validator?
            group.addEntity(entity, options, fpIdentity);
        }
    }
}

// todo jack16: another way to do this is to have a WithContext factory, which gives you all of these static methods which are context aware
// an issue with this is that we rely on private constructors, i.e. you need to go via the public static methods for create (which is probably ok...)
// probably better dev ux, you have only 1 method CreateOne + WithContext().factoryName(...)
