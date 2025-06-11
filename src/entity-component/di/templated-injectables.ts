import { IInjectable, Injectable, InjectorToken } from "./injectables.js";

/**
 * @public
 * Injectables placed into a map, with key provided by template. Removes any specific injectable typing, falling back to the interface.
 */
export type TTemplatedInjectables<TTemplate> = {
    [K in keyof TTemplate]: TTemplate[K] extends (IInjectable<infer U> | undefined) ? IInjectable<U> : never
}

/**
 * @public
 * The corresponding values to {@link TTemplatedInjectables}.
 */
export type TTemplatedValues<TTemplate extends TTemplatedInjectables<TTemplate>> = {
    [K in keyof TTemplate]: TTemplate[K] extends IInjectable<infer U> ? U : never
};

/**
 * @public
 * todo jack: seems like this one has a more stable type, you can do same trick as before? like TWithFactory?
 * todo jack: probably best to stick to template naming
 */
export interface ITemplatedInjectableFactory<
    TTemplate extends TTemplatedInjectables<TTemplate>,
    TFactory extends (...args: never[]) => unknown,
    TValue = never
>
{
    (template: TTemplatedInjectables<TTemplate>): IInjectable<TValue>;
    createOne: TFactory;
}

/**
 * @public
 * @summary Not all injectables can be created statically, in some cases the resolved type is dependent on the options used.
 *
 * todo jack: usage notes
 * TValue should either be a base class or a union type, the generics can then specialize this based on the arguments.
 */
export class TemplatedInjectableFactory
{
    // todo jack: simplify naming if it pans out... (also it returns a builder...) basically should be a function at this point
    /**
     * @summary Create an injectable whose type is predicated on the template being filled in, i.e. the type cannot be inferred
     * without the template's settings arg.
     * @param createToken - The resulting injectable will have this token.
     * @param createDependencyTemplate - The dependencies that have to be filled in by the user.
     * @param applyDependencies - Create the resulting injectable's resolved value, this is not exposed.
     * @param factory - The underlying factory function, to  be exposed on the resulting builder.
     */
    public static createOne<
        TValue,
        TTemplate extends TTemplatedInjectables<TTemplate>,
        TFactory extends (...args: never[]) => unknown
    >
    (
        createToken: () => InjectorToken,
        createDependencyTemplate: () => TTemplate,
        applyDependencies: (resolvedDependencies: TTemplatedValues<TTemplate>) => TValue,
        factory: TFactory,
    )
        : ITemplatedInjectableFactory<TTemplate, TFactory, TValue>
    {
        const callback = (userTemplate: TTemplatedInjectables<TTemplate>): IInjectable<TValue> =>
        {
            const token = createToken();
            const dependencyTemplate = createDependencyTemplate();
            const mergedTemplate = { ...dependencyTemplate, ...userTemplate };
            return TemplatedInjectableFactory.createResolvedDictionary(mergedTemplate, token, applyDependencies);
        };
        callback.createOne = factory;

        return callback as ITemplatedInjectableFactory<TTemplate, TFactory, TValue>;
    }

    private static createResolvedDictionary<TValue, TTemplate extends TTemplatedInjectables<TTemplate>>
    (
        mergedTemplate: TTemplate,
        token: InjectorToken,
        applyDependencies: (resolvedDependencies: TTemplatedValues<TTemplate>) => TValue,
    )
    {
        const depKeys = Object.keys(mergedTemplate) as (keyof TTemplate)[];
        const mergedDeps = new Array<IInjectable<unknown>>(depKeys.length);

        for (let i = 0, iEnd = depKeys.length; i < iEnd; ++i)
        {
            mergedDeps[i] = mergedTemplate[depKeys[i]];
        }

        return new Injectable<TValue, IInjectable<unknown>[]>(token, mergedDeps, (...resolvedDeps: unknown[]) =>
        {
            const resolvedDictionary = {} as TTemplatedValues<TTemplate>;

            for (let i = 0, iEnd = depKeys.length; i < iEnd; ++i)
            {
                resolvedDictionary[depKeys[i]] = resolvedDeps[i] as never;
            }

            return applyDependencies(resolvedDictionary);
        });
    }
}
