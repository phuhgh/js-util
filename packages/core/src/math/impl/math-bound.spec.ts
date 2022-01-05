import { mathBound } from "./math-bound";
import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse, resetDebugState } from "@rc-js-util/test";

describe("=> mathBound", () =>
{
    beforeEach(() => resetDebugState());

    test("| bounds the value", () =>
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

        test("| errors with NaN input", () =>
        {
            expect(() => mathBound(NaN, 0, 1)).toThrow();
            expect(() => mathBound(1, NaN, 1)).toThrow();
            expect(() => mathBound(1, 0, NaN)).toThrow();
            expect(() => mathBound(1, 1, 0)).toThrow();
        });
    });
});