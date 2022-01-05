import { mapValuesToArray } from "./map-values-to-array";
import { resetDebugState } from "@rc-js-util/test";

describe("=> mapValuesToArray", () =>
{
    const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);

    beforeEach(() => resetDebugState());

    test("| returns the map's values", () =>
    {
        const result: (1 | 2 | 3)[] = mapValuesToArray(values);
        expect(result).toEqual([1, 2, 3]);
    });
});