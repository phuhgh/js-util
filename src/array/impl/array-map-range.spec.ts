import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse } from "../../test-util/test-utils.js";
import { arrayMapRange } from "./array-map-range.js";
import { fpIdentity } from "../../fp/impl/fp-identity.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayMapRange", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    describe("=> in debug mode", () =>
    {
        itShouldCallAssert(1, () =>
        {
            arrayMapRange(0, 10, () => 1);
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

    describe("=> reverse range", () =>
    {
        it("| generates an inclusive range", () =>
        {
            expect(arrayMapRange(10, 0, fpIdentity)).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        });
    });
});