import { mapValuesToArray } from "./map-values-to-array";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> mapValuesToArray", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);

    it("| returns the map's values", () =>
    {
        const result: (1 | 2 | 3)[] = mapValuesToArray(values);
        expect(result).toEqual([1, 2, 3]);
    });
});