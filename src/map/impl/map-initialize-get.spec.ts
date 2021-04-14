/* tslint:disable:newline-per-chained-call */
import { mapInitializeGet } from "./map-intialize-get";

describe("=> mapInitializeGet", () =>
{
    const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);

    it("| returns the value where available", () =>
    {
        const result: 1 | 2 | 3 | 5 = mapInitializeGet(values, "a", () => 5);
        expect(result).toEqual(1);
    });

    it("| returns the value of the callback where no value", () =>
    {
        const result: 1 | 2 | 3 | 5 = mapInitializeGet(values, "d", () => 5);
        expect(result).toEqual(5);
    });
});