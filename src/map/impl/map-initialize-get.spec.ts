import { mapInitializeGet } from "./map-intialize-get.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mapInitializeGet", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns the value where available", () =>
    {
        const values: Map<"a" | "b" | "c" | "d", 1 | 2 | 3 | 4 | 5> = new Map([["a", 1], ["b", 2], ["c", 3]]);
        const result: 1 | 2 | 3 | 4 | 5 = mapInitializeGet(values, "a", () => 5 as const);
        expect(result).toEqual(1);
    });

    it("| returns the value of the callback where no value", () =>
    {
        const values: Map<"a" | "b" | "c" | "d", 1 | 2 | 3 | 4 | 5> = new Map([["a", 1], ["b", 2], ["c", 3]]);
        const result: 1 | 2 | 3 | 4 | 5 = mapInitializeGet(values, "d", () => 5 as const);
        expect(result).toEqual(5);
    });

    describe("=> compile checks", () =>
    {
        it("| doesn't allow keys and values not supported by the map", () =>
        {
            const values: Map<"a" | "b" | "c" | "d", 1 | 2 | 3 | 4 | 5> = new Map([["a", 1], ["b", 2], ["c", 3]]);
            // @ts-expect-error - should be a compile error, key not in set
            mapInitializeGet(values, "e", () => 5 as const);
            // @ts-expect-error - should be a compile error, value not in set
            mapInitializeGet(values, "d", () => 6 as const);
        });
    });
});