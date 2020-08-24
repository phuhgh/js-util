import { itShouldCallAssert, itShouldNotRunDebugWhenDebugIsFalse } from "../../test-utils";
import { _Debug } from "../../debug/_debug";
import { arrayIndexByKey } from "./array-index-by-key";

/* tslint:disable:newline-per-chained-call */
describe("=> arrayToDictionary", () =>
{
    const testData = [
        { k: "a" },
        { k: "b" },
        { k: "c" },
    ];

    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
    });

    itShouldNotRunDebugWhenDebugIsFalse(() =>
    {
        arrayIndexByKey([{ k: "a" }], "k");
    });

    it("| assigns the array elements by the key", () =>
        {
            const actual = arrayIndexByKey(testData, "k");

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

        describe("=> false / undefined", () =>
        {
            itShouldCallAssert(6, () =>
            {
                arrayIndexByKey(testData, "k");
            });

            it("| errors when there are duplicates", () =>
            {
                expect(() => arrayIndexByKey(dataWithDupes, "k")).toThrow();
            });
        });

        describe("=> true", () =>
        {
            itShouldCallAssert(3, () =>
            {
                arrayIndexByKey(testData, "k", true);
            });

            it("| returns object without duplicates", () =>
            {
                const actual = arrayIndexByKey(dataWithDupes, "k", true);
                const expected = {
                    a: { k: "a" },
                    b: { k: "b" },
                };
                expect(expected).toEqual(actual as any);
            });
        });
    });
});