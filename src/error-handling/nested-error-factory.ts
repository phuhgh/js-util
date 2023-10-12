import { _Debug } from "../debug/_debug.js";

/**
 * @public
 * An error which can have a chain of causes.
 */
export interface INestedError<TLocalization>
{
    readonly stack: string;
    readonly causedBy: unknown;
    /**
     * @returns The localized error message for the user.
     */
    getMessage(): TLocalization;
    /**
     * Create a localized error message that describes what went wrong, and includes some minimal
     * technical detail that's likely to describe the root cause.
     */
    composeErrorMessages(): IErrorSummary<TLocalization>;

    /**
     * Attempt to serialize `causedBy`, where this is not possible, undefined is returned.
     */
    causeToString(): string | undefined;

    /**
     * Stringifies the causes of the error, following the chain. This is intended for developers and includes
     * stack traces at each step.
     */
    toString(): string;
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
 * A flattened {@link INestedError}, ready to be localized and shown to the user.
 */
export interface IErrorSummary<TLocalization>
{
    /**
     * A user-friendly description of what went wrong. The stringified localization can be joined to form a sentence.
     */
    messages: TLocalization[];
    /**
     * Can be anything libraries are throwing, failing that a stack trace. Generally not
     * appropriate to show to the user, except as additional information after the localized messages.
     */
    detail?: string;
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
            protected readonly message: TLocalization,
            public readonly causedBy: unknown,
        )
        {
            this.stack = _Debug.getStackTrace();
        }

        public getMessage(): TLocalization
        {
            return this.message;
        }

        public composeErrorMessages(): IErrorSummary<TLocalization>
        {
            const messages: TLocalization[] = [this.getMessage()];
            // we're only ever interested in the innermost exception for stack traces etc.
            let exceptionDetail: string = this.stack;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let currentError: NestedError = this;

            while (currentError.causedBy != null)
            {
                if (NestedError.isError(currentError.causedBy))
                {
                    messages.push(currentError.causedBy.message);
                    currentError = currentError.causedBy;
                }
                else
                {
                    const detail = currentError.causeToString();
                    if (detail != null)
                    {
                        // it's likely to provide more context than the composable error stack trace
                        exceptionDetail = detail;
                    }
                    break;
                }
            }

            return {
                messages: messages,
                detail: exceptionDetail,
            };
        }

        public causeToString(): string | undefined
        {
            if (typeof this.causedBy == null)
            {
                return undefined;
            }

            if (this.causedBy instanceof NestedError)
            {
                // one of ours...
                return this.causedBy.toString();
            }

            if (this.causedBy instanceof Error)
            {
                // firefox sometimes populates things with empty strings (e.g. network errors)
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                if (this.causedBy.message && this.causedBy.stack)
                {
                    return [this.causedBy.stack, this.stack].join("\n");
                }

                if (this.causedBy.message)
                {
                    return this.causedBy.message;
                }

                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                if (this.causedBy.stack)
                {
                    return this.causedBy.stack;
                }

                // it's an error, but not as we know it...
                return guardedToString(this.causedBy);
            }

            switch (typeof this.causedBy)
            {
                case "string":
                    return this.causedBy;
                case "object":
                    // generally speaking, an object's toString method doesn't produce useful output
                    // => don't throw random objects...
                    return JSON.stringify(this.causedBy);
                case "boolean":
                case "number":
                case "function":
                case "symbol":
                case "bigint":
                    // hanging offense if you actually hit this
                    return this.causedBy.toString();
                case "undefined": // we checked for == null above
                default:
                    // notionally it's not possible to get here, but just in case
                    _Debug.error(`unexpected code path, unknown type ${typeof this.causedBy}`);
                    return "Received non-serializable exception, skipping.";
            }
        }

        public toString(): string
        {
            const cause = this.causeToString();

            if (cause == null)
            {
                return [
                    NestedError.ctorConfig.getTxFallback(this.getMessage()),
                    this.stack,
                ].join("\n");
            }
            else
            {
                return [
                    NestedError.ctorConfig.getTxFallback(this.getMessage()),
                    this.stack + "\n",
                    `=======================CAUSE FOLLOWS=======================`,
                    cause
                ].join("\n");
            }
        }

        private static ctorConfig = config;
    };
}


// guard against very silly toString overrides...
function guardedToString(object: object): string | undefined
{
    if (typeof object.toString !== "function")
    {
        return undefined;
    }
    const result = object.toString() as unknown;
    return typeof result === "string" ? result : undefined;
}