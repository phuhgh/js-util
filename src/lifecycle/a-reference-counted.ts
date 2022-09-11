import { _Debug } from "../debug/_debug.js";
import { lifecycleStack } from "../web-assembly/emscripten/lifecycle-stack.js";

/**
 * @public
 * Provides a way to handle cleanup of manually managed resources where there is not a single owner.
 */
export interface IReferenceCounted
{
    claim(): void;
    release(): void;
    getIsDestroyed(): boolean;
}

/**
 * @public
 * Provides a way to handle cleanup of manually managed resources where there is not a single owner.
 * NB The object is pre-claimed (ref count 1) on creation.
 */
export abstract class AReferenceCounted implements IReferenceCounted
{
    /**
     * Take a claim on the object, preventing it from being destroyed. Once you're done with the object you should
     * call `release`.
     *
     * Typically, these should not be called directly, make use of `{@link blockScopedLifecycle}` or
     * {@link ILinkedReferenceCounter.bindBlockScope} instead.
     */
    public claim(): void
    {
        if (this.references === 0)
        {
            _BUILD.DEBUG && _Debug.error("object has been released already");
            return;
        }

        ++this.references;
    }

    /**
     * Release claim on the object, objects start with a reference count of 1 (the creator); if you didn't create the
     * object, you shouldn't release it if you didn't call `claim` first.
     */
    public release(): void
    {
        if (--this.references === 0)
        {
            this.onFree();
        }
    }

    public getIsDestroyed(): boolean
    {
        return this.references <= 0;
    }

    /**
     * DO NOT CALL THIS DIRECTLY, CALL RELEASE.
     */
    protected abstract onFree(): void;

    protected constructor()
    {
        lifecycleStack.register(this);
    }

    private references = 1;
}
