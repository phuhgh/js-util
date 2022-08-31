import { mapKeysToArray } from "./map-keys-to-array";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> mapKeysToArray", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);

    it("| returns the map's keys", () =>
    {
        const result: ("a" | "b" | "c")[] = mapKeysToArray(values);
        expect(result).toEqual(["a", "b", "c"]);
    });
});