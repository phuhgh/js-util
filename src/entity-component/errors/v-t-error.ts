import { NestedError } from "../../error-handling/nested-error.js";

/**
 * @public
 */
export enum EErrorCause
{

    DependencyResolutionError = 1,
    ShaderCompileError,
    ContextAcquisitionError,
    RequiredRenderExtensionUnavailable,
}

/**
 * @public
 */
export class VTError extends NestedError
{
    public constructor(public readonly cause: EErrorCause, additionalContext: unknown)
    {
        super(VTError.errorMessages[cause], additionalContext);
    }

    private static readonly errorMessages = {
        [EErrorCause.DependencyResolutionError]: "Resolution failed.",
        [EErrorCause.ShaderCompileError]: "Failed to compile shader program, errors / warnings follow:",
        [EErrorCause.ContextAcquisitionError]: "Failed to acquire graphics context.",
        [EErrorCause.RequiredRenderExtensionUnavailable]: "One or more render extensions listed as being required is not available.",
    };
}