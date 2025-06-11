import { IInjectable, InjectorToken } from "./injectables.js";

/**
 * @public
 * todo jack: docs, naming should be more specific (VtModule?)
 */
export class DiModule
{
    /**
     * @remark Must be called before modules are resolved.
     * @brief Instead of using the default implementation for that injectable token, instead the provided injectable will
     * be used once values are resolved.
     */
    public override(injectable: IInjectable<unknown>): void
    {
        this.overrides.set(injectable.token, injectable);
    }

    /**
     * See if the injectable has an associated value. It is not permissible to store `undefined`, this is equivalent to "not present".
     * @remark Internal API, use the injectable methods, this might not be the current value (the injectables have better
     * typing too...).
     */
    public retrieveValue<TValue>
    (
        token: InjectorToken,
    )
        : TValue | undefined
    {
        return this.resolvedInjectables.get(token) as TValue | undefined;
    }

    /**
     * Store a value against the injectable token for this module.
     * @remark Internal API, use the injectable methods, they have better typing.
     */
    public storeValue<TValue>
    (
        token: InjectorToken,
        value: TValue,
    )
        : void
    {
        this.resolvedInjectables.set(token, value);
    }

    public resolveInjectable<TValue>(injectable: IInjectable<TValue>): IInjectable<TValue>
    {
        const override = this.overrides.get(injectable.token);

        if (override != null)
        {
            return override as IInjectable<TValue>;
        }
        else
        {
            return injectable;
        }
    }

    private resolvedInjectables = new WeakMap<InjectorToken, unknown>();
    private overrides = new WeakMap<InjectorToken, IInjectable<unknown>>();
}