import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse } from "../../test-util/test-utils.js";
import { mathMin } from "./math-min.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> mathMin", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the smaller value", () =>
    {
        expect(mathMin(1, 0)).toBe(0);
        expect(mathMin(0, 1)).toBe(0);
    });

    describe("=> in production", () =>
    {
        itShouldNotRunDebugWhenDebugIsFalse(() => mathMin(1, 0));
    });

    describe("=> in debug", () =>
    {
        itShouldCallAssert(2, () => mathMin(1, 0));

        it("| errors with NaN input", () =>
        {
            expect(() => mathMin(NaN, 0)).toThrow();
            expect(() => mathMin(1, NaN)).toThrow();
        });
    });
});