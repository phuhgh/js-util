/* tslint:disable:newline-per-chained-call */
import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse } from "../../test-utils";
import { _Debug } from "../../debug/_debug";
import { mathMax } from "./math-max";

describe("=> mathMax", () =>
{
    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
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