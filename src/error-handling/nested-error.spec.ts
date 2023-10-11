import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";
import { NestedError } from "./nested-error.js";

describe("=> NestableError", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    describe("=> isError", () =>
    {
        it("| returns whether the error is an extension", () =>
        {
            expect(NestedError.isError(1)).toBe(false);
            expect(NestedError.isError(new NestedError("test", null))).toBe(true);
        });
    });

    describe("=> normalizeError", () =>
    {
        it("| returns the error if it's an extension", () =>
        {
            const error = new NestedError("test", null);
            expect(NestedError.normalizeError(error)).toBe(error);
        });

        it("| returns the default if it's not an extension", () =>
        {
            const error = new Error("test");
            const normalized = NestedError.normalizeError(error);
            expect(normalized.message).toBe("An unknown error occurred.");
            expect(normalized.causedBy).toBe(error);
        });
    });

    describe("=> getRootCause", () =>
    {
        it("| returns the inner-most exception", () =>
        {
            const nested = new NestedError("outer", new NestedError("inner", null));
            expect(NestedError.getRootCause(nested).message).toBe("inner");
        });

        it("| returns the default error if the error is not related", () =>
        {
            const error = new Error("test");
            const normalized = NestedError.getRootCause(error);
            expect(normalized.message).toBe("An unknown error occurred.");
            expect(normalized.causedBy).toBe(error);
        });
    });
});