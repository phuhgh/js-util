/* tslint:disable:newline-per-chained-call */
import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse } from "../../test-utils";
import { _Debug } from "../../debug/_debug";
import { mathMin } from "./math-min";

describe("=> mathMin", () =>
{
    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
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