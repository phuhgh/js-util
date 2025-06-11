import { EErrorCause, VTError } from "../errors/v-t-error.js";
import { _Debug } from "../../debug/_debug.js";

export class InjectableError extends VTError
{
    public static extendContext(tokenName: string, error: unknown): InjectableError
    {
        const tokens: string[] = error instanceof InjectableError
            ? error.tokenNames.concat(tokenName)
            : [tokenName];

        return new InjectableError(tokens, error);
    }

    public constructor
    (
        public readonly tokenNames: readonly string[],
        errorContext: unknown,
    )
    {
        super(EErrorCause.DependencyResolutionError, errorContext);
        _BUILD.DEBUG && _Debug.assert(tokenNames.length > 0, "there must be at least one tokenName...");
    }

    public override getMessage(): string
    {
        if (this.tokenNames.length <= 1)
        {
            return `Failed to resolve injectable "${this.tokenNames[0]}": ${VTError.getRootCause(this).causeToString()}`;
        }
        else
        {
            return `Failed to resolve injectable "${this.tokenNames[0]}" with dependency chain ${this.tokenNames.join(" <- ")}.\n${VTError.getRootCause(this).causeToString()}`;
        }
    }
}