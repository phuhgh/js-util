import { mapClearingDeleteFromSet } from "./map-clearing-delete-from-set.js";
import { _Set } from "../../set/_set.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mapClearingDeleteFromSet", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| deletes where set exists and value is present", () =>
    {
        const values = new Map([["a", new Set([1])]]);
        mapClearingDeleteFromSet(values, "a", 1);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(values.get("a")).toEqual(undefined);
    });

    it("| returns the set", () =>
    {
        const values = new Map([["a", new Set([1, 2])]]);
        mapClearingDeleteFromSet(values, "a", 1);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(_Set.valuesToArray(values.get("a")!)).toEqual([2]);
    });
});