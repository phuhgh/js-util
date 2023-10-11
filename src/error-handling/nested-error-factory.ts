import { _Debug } from "../debug/_debug.js";

/**
 * @public
 * An error which can have a chain of causes.
 */
export interface INestedError<TLocalization>
{
    readonly stack: string;
    readonly message: TLocalization;
    readonly causedBy: unknown;
}

/**
 * @public
 * Constructor to {@link INestedError}.
 */
export interface INestedErrorCtor<TLocalization, TInstance extends INestedError<TLocalization>>
{
    new(message: TLocalization, causedBy: unknown): TInstance;
    isError(error: unknown): error is TInstance;
    getRootCause(error: unknown): TInstance;
    normalizeError(error: unknown): TInstance;
}

/**
 * @public
 * The config used to create `NestedError` constructors, used by {@link getNestedErrorCtor}.
 */
export interface INestedErrorCtorConfig<ILocalization>
{
    /**
     * Given a localization, convert it to a somewhat human-readable string. This should NOT be using any localization system
     * if there's any chance it can fail to load. This is intended for cases where the localization system is not available.
     */
    getTxFallback: (localization: ILocalization) => string;
    /**
     * In the event that an error is not an extensions of this class, this message will be used.
     */
    defaultError: ILocalization;
}

/**
 * @public
 * Factory for creating a localized `NestedError` class, see {@link INestedError}. This should be used
 * to create a base class, from which you can create extensions to represent specific error cases.
 */
export function getNestedErrorCtor<TLocalization>
(
    config: INestedErrorCtorConfig<TLocalization>,
)
    : INestedErrorCtor<TLocalization, INestedError<TLocalization>>
{
    return class NestedError implements INestedError<TLocalization>
    {
        public static isError(error: unknown): error is NestedError
        {
            return error instanceof this;
        }

        public static normalizeError(error: unknown): NestedError
        {
            if (NestedError.isError(error))
            {
                return error;
            }

            return new NestedError(NestedError.ctorConfig.defaultError, error);
        }

        public static getRootCause(error: unknown): NestedError
        {
            const normalizedError = NestedError.normalizeError(error);

            if (NestedError.isError(normalizedError.causedBy))
            {
                return NestedError.getRootCause(normalizedError.causedBy);
            }
            else
            {
                return normalizedError;
            }
        }

        public readonly stack: string;

        public constructor
        (
            public readonly message: TLocalization,
            public readonly causedBy: unknown,
        )
        {
            this.stack = _Debug.getStackTrace();
        }

        public toString(): string
        {
            return [
                NestedError.ctorConfig.getTxFallback(this.message),
                this.stack,
            ].join("\n");
        }

        private static ctorConfig = config;
    };
}
