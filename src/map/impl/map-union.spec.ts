import { mapUnion } from "./map-union.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> mapUnion", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the union", () =>
    {
        expect(Array.from(mapUnion(new Map([["a", "b"], ["b", "c"]]), new Map([["d", "e"]]))))
            .toEqual([["a", "b"], ["b", "c"], ["d", "e"]]);
    });
});