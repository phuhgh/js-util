import { arrayMapRange } from "./array-map-range";
import { fpIdentity } from "../../fp/impl/fp-identity";
import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse, resetDebugState } from "@rc-js-util/test";

describe("=> arrayMapRange", () =>
{
    beforeEach(() => resetDebugState());

    describe("=> in debug mode", () =>
    {
        itShouldCallAssert(1, () =>
        {
            arrayMapRange(0, 10, () => 1);
        });

        test("| errors if inputs are NaN", () =>
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

    test("| passes the correct index", () =>
    {
        expect(arrayMapRange(-10, 0, (_value, index) => index)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    describe("=> positive range", () =>
    {
        test("| generates an inclusive range", () =>
        {
            expect(arrayMapRange(0, 10, fpIdentity)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
    });

    describe("=> no range", () =>
    {
        test("| generates an inclusive range", () =>
        {
            expect(arrayMapRange(0, 0, fpIdentity)).toEqual([0]);
        });
    });

    describe("=> negative range", () =>
    {
        test("| generates an inclusive range", () =>
        {
            expect(arrayMapRange(-10, 0, fpIdentity)).toEqual([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0]);
        });
    });

    describe("=> reverse range", () =>
    {
        test("| generates an inclusive range", () =>
        {
            expect(arrayMapRange(10, 0, fpIdentity)).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        });
    });
});