import { mathMin } from "./math-min";
import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse, resetDebugState } from "@rc-js-util/test";

describe("=> mathMin", () =>
{
    beforeEach(() => resetDebugState());

    test("| returns the smaller value", () =>
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

        test("| errors with NaN input", () =>
        {
            expect(() => mathMin(NaN, 0)).toThrow();
            expect(() => mathMin(1, NaN)).toThrow();
        });
    });
});