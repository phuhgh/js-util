import { setValuesToArray } from "./set-values-to-array";

describe("=> setValuesToArray", () =>
{
    const values = new Set([1, 2, 3] as const);

    it("| returns the map's values", () =>
    {
        const result: (1 | 2 | 3)[] = setValuesToArray(values);
        expect(result).toEqual([1, 2, 3]);
    });
});