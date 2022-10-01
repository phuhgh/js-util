import { mapKeysToArray } from "./map-keys-to-array.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mapKeysToArray", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);

    it("| returns the map's keys", () =>
    {
        const result: ("a" | "b" | "c")[] = mapKeysToArray(values);
        expect(result).toEqual(["a", "b", "c"]);
    });
});