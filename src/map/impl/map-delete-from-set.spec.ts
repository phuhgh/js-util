import { _Set } from "../../set/_set.js";
import { mapDeleteFromSet } from "./map-delete-from-set.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mapDeleteFromSet", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values = new Map([["a", new Set([1])]]);

    it("| deletes where set exists and value is present", () =>
    {
        mapDeleteFromSet(values, "a", 1);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(_Set.valuesToArray(values.get("a")!)).toEqual([]);
    });
});