import { mapFirstValue } from "./map-first-value.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mapFirstValue", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns the first key where available", () =>
    {
        const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);
        const result: 1 | 2 | 3 | undefined = mapFirstValue(values);
        expect(result).toEqual(1);
    });

    it("| returns undefined if empty", () =>
    {
        const values = new Map();
        const result = mapFirstValue(values);
        expect(result).toEqual(undefined);
    });
});