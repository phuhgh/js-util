import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse } from "../../test-util/test-utils.js";
import { mathMax } from "./math-max.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mathMax", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns the larger value", () =>
    {
        expect(mathMax(1, 0)).toBe(1);
        expect(mathMax(0, 1)).toBe(1);
    });

    describe("=> in production", () =>
    {
        itShouldNotRunDebugWhenDebugIsFalse(() => mathMax(1, 0));
    });

    describe("=> in debug", () =>
    {
        itShouldCallAssert(2, () => mathMax(1, 0));

        it("| errors with NaN input", () =>
        {
            expect(() => mathMax(NaN, 0)).toThrow();
            expect(() => mathMax(1, NaN)).toThrow();
        });
    });
});