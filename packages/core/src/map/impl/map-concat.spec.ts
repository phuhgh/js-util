import { mapConcat } from "./map-concat";
import { resetDebugState } from "@rc-js-util/test";

describe("=> mapConcat", () =>
{
    const values = new Map([["a", [1]]]);

    beforeEach(() => resetDebugState());

    test("| concats where array exists", () =>
    {
        mapConcat(values, "a", [2]);
        expect(values.get("a")).toEqual([1, 2]);
    });

    test("| creates a copy of the array where key not defined", () =>
    {
        const original = [3];
        mapConcat(values, "b", [3]);
        expect(values.get("b")).toEqual([3]);
        expect(values.get("b")).not.toBe(original);
    });
});