import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse } from "../../test-utils";
import { _Debug } from "../../debug/_debug";
import { arrayBinaryIndexOf } from "./array-binary-index-of";
import { arrayBinaryLastIndexOf } from "./array-binary-last-index-of";

/* tslint:disable:newline-per-chained-call */
describe("=> binary index of", () =>
{
    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
    });

    describe("=> common behaviour", () =>
    {
        [
            [arrayBinaryLastIndexOf, "arrayBinaryLastIndexOf"] as const,
            [arrayBinaryIndexOf, "arrayBinaryIndexOf"] as const,
        ].forEach(([binaryIndexOf, name]) =>
        {
            describe(`=> ${name}`, () =>
            {
                describe("=> in debug mode", () =>
                {
                    itShouldCallAssert(12, () =>
                    {
                        binaryIndexOf([1, 2, 3], 2, (a, i) => a[i], 3);
                    });

                    it("| errors if data isn't sorted", () =>
                    {
                        expect(() => binaryIndexOf([3, 2, 3], 2, (a, i) => a[i], 3)).toThrow();
                    });

                    it("| errors if the comparison value to search for is NaN", () =>
                    {
                        expect(() => binaryIndexOf([1, 2, 3], NaN, (a, i) => a[i], 3)).toThrow();
                    });

                    it("| errors if generated comparison value is NaN", () =>
                    {
                        expect(() => binaryIndexOf([1, NaN, 3], 2, (a, i) => a[i], 3)).toThrow();
                    });
                });

                itShouldNotRunDebugWhenDebugIsFalse(() =>
                {
                    binaryIndexOf([1, 2, 3], 2, (a, i) => a[i], 3);
                });

                describe("=> where the value doesn't exist", () =>
                {
                    it("| returns -1", () =>
                    {
                        expect(binaryIndexOf([1, 2, 2, 3], 2.5, (a, i) => a[i], 4)).toBe(-1);
                    });
                });
            });

            describe("=> where the value exists", () =>
            {
                it("| returns first element index", () =>
                {
                    expect(binaryIndexOf([1, 2, 2, 3], 1, (a, i) => a[i], 4)).toBe(0);
                    expect(binaryIndexOf([1], 1, (a, i) => a[i], 1)).toBe(0);
                });

                it("| returns last element index", () =>
                {
                    expect(binaryIndexOf([1, 2, 2, 3], 3, (a, i) => a[i], 4)).toBe(3);
                });

                describe("=> where min max specified", () =>
                {
                    it("| is respected", () =>
                    {
                        expect(binaryIndexOf([1, 2, 2, 3, 3], 1, (a, i) => a[i], 4, 1)).toBe(-1);
                        expect(binaryIndexOf([1, 2, 2, 3, 3], 3, (a, i) => a[i], 3)).toBe(-1);
                    });
                });
            });
        });
    });

    describe("=> binaryIndexOf", () =>
    {
        describe("=> where multiple values exist", () =>
        {
            it("| returns first index", () =>
            {
                expect(arrayBinaryIndexOf([1, 2, 2, 3], 2, (a, i) => a[i], 4)).toBe(1);
                expect(arrayBinaryIndexOf([1, 1, 2, 2, 3], 1, (a, i) => a[i], 5)).toBe(0);
                expect(arrayBinaryIndexOf([1, 2, 2, 3, 3], 3, (a, i) => a[i], 5)).toBe(3);
            });
        });

        describe("=> where min max specified", () =>
        {
            it("| is respected", () =>
            {
                expect(arrayBinaryIndexOf([1, 2, 3, 4], 2, (a, i) => a[i], 3, 1)).toBe(1);
                expect(arrayBinaryIndexOf([1, 2, 3, 4], 3, (a, i) => a[i], 3,)).toBe(2);
            });
        });
    });

    describe("=> binaryLastIndexOf", () =>
    {
        describe("=>  where multiple values exist", () =>
        {
            it("| returns last index", () =>
            {
                expect(arrayBinaryLastIndexOf([1, 2, 2, 3], 2, (a, i) => a[i], 4)).toBe(2);
                expect(arrayBinaryLastIndexOf([1, 1, 2, 2, 3], 1, (a, i) => a[i], 5)).toBe(1);
                expect(arrayBinaryLastIndexOf([1, 2, 2, 3, 3], 3, (a, i) => a[i], 5)).toBe(4);
            });
        });

        describe("=> where min max specified", () =>
        {
            it("| is respected", () =>
            {
                expect(arrayBinaryLastIndexOf([1, 2, 3, 4], 2, (a, i) => a[i], 3, 1)).toBe(1);
                expect(arrayBinaryLastIndexOf([1, 2, 3, 4], 3, (a, i) => a[i], 3,)).toBe(2);
            });
        });
    });

});