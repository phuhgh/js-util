/* tslint:disable:newline-per-chained-call */
import { mapFirstKey } from "./map-first-key";

describe("=> mapFirstKey", () =>
{

    it("| returns the first key where available", () =>
    {
        const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);
        const result: "a" | "b" | "c" | undefined = mapFirstKey(values);
        expect(result).toEqual("a");
    });

    it("| returns undefined if empty", () =>
    {
        const values = new Map();
        const result = mapFirstKey(values);
        expect(result).toEqual(undefined);
    });
});