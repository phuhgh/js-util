import { mapKeysToArray } from "./map-keys-to-array";
import { resetDebugState } from "@rc-js-util/test";

describe("=> mapKeysToArray", () =>
{
    const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);

    beforeEach(() => resetDebugState());

    it("| returns the map's keys", () =>
    {
        const result: ("a" | "b" | "c")[] = mapKeysToArray(values);
        expect(result).toEqual(["a", "b", "c"]);
    });
});