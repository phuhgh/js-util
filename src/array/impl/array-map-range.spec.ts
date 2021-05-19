import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse } from "../../test-utils";
import { _Debug } from "../../debug/_debug";
import { arrayMapRange } from "./array-map-range";
import { fpIdentity } from "../../fp/impl/fp-identity";

describe("=> arrayMapRange", () =>
{
    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
    });

    describe("=> in debug mode", () =>
    {
        itShouldCallAssert(2, () =>
        {
            arrayMapRange(0, 10, () => 1);
        });

        it("| errors if from is bigger than to", () =>
        {
            expect(() => arrayMapRange(10, 0, fpIdentity)).toThrow();
        });

        it("| errors if inputs are NaN", () =>
        {
            expect(() => arrayMapRange(NaN, 0, fpIdentity)).toThrow();
            expect(() => arrayMapRange(10, NaN, fpIdentity)).toThrow();
        });
    });

    describe("=> in production mode", () =>
    {
        itShouldNotRunDebugWhenDebugIsFalse(() =>
        {
            arrayMapRange(0, 10, fpIdentity);
        });
    });

    it("| passes the correct index", () =>
    {
        expect(arrayMapRange(-10, 0, (_value, index) => index)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    describe("=> positive range", () =>
    {
        it("| generates an inclusive range", () =>
        {
            expect(arrayMapRange(0, 10, fpIdentity)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
    });
    describe("=> no range", () =>
    {
        it("| generates an inclusive range", () =>
        {
            expect(arrayMapRange(0, 0, fpIdentity)).toEqual([0]);
        });
    });
    describe("=> negative range", () =>
    {
        it("| generates an inclusive range", () =>
        {
            expect(arrayMapRange(-10, 0, fpIdentity)).toEqual([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0]);
        });
    });
});