import { mapValuesToArray } from "./map-values-to-array.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mapValuesToArray", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);

    it("| returns the map's values", () =>
    {
        const result: (1 | 2 | 3)[] = mapValuesToArray(values);
        expect(result).toEqual([1, 2, 3]);
    });
});