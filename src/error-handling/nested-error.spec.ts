import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";
import { NestedError } from "./nested-error.js";
import { getNestedErrorCtor } from "./nested-error-factory.js";

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

        it("| returns false for different error bases", () =>
        {
            const TestNestedError = getNestedErrorCtor({
                defaultError: 1,
                getTxFallback: (e) => e.toString(),
            });

            const e2 = new NestedError("", null);
            expect(TestNestedError.isError(e2)).toBe(false);
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
            expect(normalized.getMessage()).toBe("An unknown error occurred.");
            expect(normalized.causedBy).toBe(error);
        });
    });

    describe("=> getRootCause", () =>
    {
        it("| returns the inner-most exception", () =>
        {
            const nested = new NestedError("outer", new NestedError("inner", null));
            expect(NestedError.getRootCause(nested).getMessage()).toBe("inner");
        });

        it("| returns the default error if the error is not related", () =>
        {
            const error = new Error("test");
            const normalized = NestedError.getRootCause(error);
            expect(normalized.getMessage()).toBe("An unknown error occurred.");
            expect(normalized.causedBy).toBe(error);
        });
    });

    describe("=> toString", () =>
    {
        it("| flattens errors", () =>
        {
            const err = new NestedError("outer", new NestedError("inner", "detail"));
            const message = err.toString();
            // check that the key parts of the message are in the order that we expect
            expect(message).toMatch(/outer.*CAUSE FOLLOWS.*inner.*CAUSE FOLLOWS.*detail/s);
        });
    });

    describe("=> composeErrorMessages", () =>
    {
        it("| flattens the localized messages, and includes the innermost exception detail", () =>
        {
            const err = new NestedError("outer", new NestedError("inner", "detail"));
            const localizedError = err.composeErrorMessages();
            expect(localizedError.detail).toEqual("detail");
            expect(localizedError.messages).toEqual(["outer", "inner"]);
        });
    });
});