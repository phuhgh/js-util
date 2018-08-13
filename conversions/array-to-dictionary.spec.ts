import { arrayToDictionary } from "./array-to-dictionary";
import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse } from "../test-utils";

describe("=> arrayToDictionary", () =>
{
    const testData = [
        { k: "a" },
        { k: "b" },
        { k: "c" },
    ];

    beforeEach(() =>
    {
        (DEBUG_MODE as boolean) = true;
    });

    itShouldNotRunDebugWhenDebugIsFalse(() =>
    {
        arrayToDictionary([{ k: "a" }], "k");
    });

    it("| assigns the array elements by the key", () =>
        {
            const actual = arrayToDictionary(testData, "k");

            const expected = {
                a: { k: "a" },
                b: { k: "b" },
                c: { k: "c" },
            };

            expect(actual).toEqual(expected);
        },
    );

    describe("=> allowDuplicates", () =>
    {
        const dataWithDupes = [
            { k: "a" },
            { k: "b" },
            { k: "a" },
        ];

        describe("| false / undefined", () =>
        {
            itShouldCallAssert(6, () =>
            {
                arrayToDictionary(testData, "k");
            });

            it("| errors when there are duplicates", () =>
            {
                expect(() => arrayToDictionary(dataWithDupes, "k")).toThrow();
            });
        });

        describe("| true", () =>
        {
            itShouldCallAssert(3, () =>
            {
                arrayToDictionary(testData, "k", true);
            });

            it("| returns object without duplicates", () =>
            {
                const actual = arrayToDictionary(dataWithDupes, "k");
                const expected = {
                    a: { k: "a" },
                    b: { k: "b" },
                };
                expect(expected).toEqual(actual as any);
            });
        });
    });
});