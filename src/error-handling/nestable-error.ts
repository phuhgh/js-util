import { _Debug } from "../debug/_debug";
import { TGetStringFromLocalization } from "../i18n/t-get-string-from-localization";

/**
 * @public
 * Composable error, useful for automatically generating user friendly localized error messages.
 */
export class NestableError<TLocalization>
{
    /**
     * This should only be called by library extensions, not user code.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected static isErrorImpl<TError extends NestableError<TLocalization>, TLocalization>
    (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorCtor: new (...args: any[]) => TError,
        isLocalization: (message: unknown) => message is TLocalization,
        error: unknown,
    )
        : error is TError
    {
        return error instanceof errorCtor && isLocalization(error.message);
    }

    /**
     * This should only be called by library extensions, not user code.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected static normalizeErrorImpl<TError extends NestableError<TLocalization>, TLocalization>
    (
        error: unknown,
        isLocalization: (message: unknown) => message is TLocalization,
        createNestableError: (error: unknown) => TError,
    )
        : TError
    {
        if (NestableError.isErrorImpl(NestableError, isLocalization, error))
        {
            return error as TError;
        }

        return createNestableError(error);
    }

    /**
     * This should only be called by library extensions, not user code.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected static getRootCauseImpl<TError extends NestableError<TLocalization>, TLocalization>
    (
        error: unknown,
        isLocalization: (message: unknown) => message is TLocalization,
        createNestableError: (error: unknown) => TError,
    )
        : TError
    {
        const normalizedError = NestableError.normalizeErrorImpl(error, isLocalization, createNestableError);

        if (!NestableError.isErrorImpl(NestableError, isLocalization, normalizedError.causedBy))
        {
            return normalizedError;
        }

        return NestableError.getRootCauseImpl(normalizedError.causedBy, isLocalization, createNestableError);
    }

    public readonly stack: string;

    public constructor
    (
        public readonly message: TLocalization,
        public readonly causedBy: unknown,
        private readonly stringifyMessage: TGetStringFromLocalization<TLocalization>,
    )
    {
        this.stack = _Debug.getStackTrace();
    }

    public toString(): string
    {
        return [
            this.stringifyMessage(this.message),
            this.stack,
        ].join("\n");
    }
}