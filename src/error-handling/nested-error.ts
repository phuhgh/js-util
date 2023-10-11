import { getNestedErrorCtor, INestedErrorCtorConfig } from "./nested-error-factory.js";
import { fpIdentity } from "../fp/impl/fp-identity.js";

const config: INestedErrorCtorConfig<string> = {
    getTxFallback: fpIdentity,
    defaultError: "An unknown error occurred.",
};

/**
 * @public
 * A non-localized {@link INestedError}.
 */
export const NestedError = getNestedErrorCtor(config);
