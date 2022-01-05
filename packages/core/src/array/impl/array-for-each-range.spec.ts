import { fpIdentity } from "../../fp/impl/fp-identity";
import { arrayForEachRange } from "./array-for-each-range";
import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse, resetDebugState } from "@rc-js-util/test";

describe("=> arrayForEachRange", () =>
{
    beforeEach(() => resetDebugState());

    describe("=> in debug mode", () =>
    {
        itShouldCallAssert(1, () =>
        {
            arrayForEachRange(0, 10, () => 1);
        });

        test("| errors if inputs are NaN", () =>
        {
            expect(() => arrayForEachRange(NaN, 0, fpIdentity)).toThrow();
            expect(() => arrayForEachRange(10, NaN, fpIdentity)).toThrow();
        });
    });

    describe("=> in production mode", () =>
    {
        itShouldNotRunDebugWhenDebugIsFalse(() =>
        {
            arrayForEachRange(0, 10, fpIdentity);
        });
    });

    describe("=> positive range", () =>
    {
        test("| generates an inclusive range", () =>
        {
            const results: number[] = [];
            arrayForEachRange(0, 10, collect(results));
            expect(results).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
    });

    describe("=> no range", () =>
    {
        test("| generates an inclusive range", () =>
        {
            const results: number[] = [];
            arrayForEachRange(0, 0, collect(results));
            expect(results).toEqual([0]);
        });
    });

    describe("=> negative range", () =>
    {
        test("| generates an inclusive range", () =>
        {
            const results: number[] = [];
            arrayForEachRange(-10, 0, collect(results));
            expect(results).toEqual([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0]);
        });
    });

    describe("=> reverse range", () =>
    {
        test("| generates an inclusive range", () =>
        {
            const results: number[] = [];
            arrayForEachRange(10, 0, collect(results));
            expect(results).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        });
    });

    function collect(a: number[])
    {
        return function (value: number)
        {
            a.push(value);
        };
    }
});