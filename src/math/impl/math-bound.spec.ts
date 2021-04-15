/* tslint:disable:newline-per-chained-call */
import { mathBound } from "./math-bound";
import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse } from "../../test-utils";
import { _Debug } from "../../debug/_debug";

describe("=> mathBound", () =>
{
    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
    });

    it("| bounds the value", () =>
    {
        expect(mathBound(1, 0, 2)).toBe(1);
        expect(mathBound(-1, 0, 2)).toBe(0);
        expect(mathBound(3, 0, 2)).toBe(2);
    });

    describe("=> in production", () =>
    {
        itShouldNotRunDebugWhenDebugIsFalse(() => mathBound(1, 0, 2));
    });

    describe("=> in debug", () =>
    {
        itShouldCallAssert(4, () => mathBound(1, 0, 2));

        it("| errors with NaN input", () => {
            expect(() => mathBound(NaN, 0, 1)).toThrow();
            expect(() => mathBound(1, NaN, 1)).toThrow();
            expect(() => mathBound(1, 0, NaN)).toThrow();
            expect(() => mathBound(1, 1, 0)).toThrow();
        });
    });
});