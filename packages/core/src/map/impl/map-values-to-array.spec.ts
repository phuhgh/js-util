import { mapValuesToArray } from "./map-values-to-array";
import { debugDescribe } from "../../test-utils";

debugDescribe("=> mapValuesToArray", () =>
{
    const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);

    it("| returns the map's values", () =>
    {
        const result: (1 | 2 | 3)[] = mapValuesToArray(values);
        expect(result).toEqual([1, 2, 3]);
    });
});