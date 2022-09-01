import { mapSetDifference } from "./map-set-difference.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> mapSetDifference", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the difference", () =>
    {
        expect(Array.from(mapSetDifference(new Map([["a", "b"], ["b", "c"]]), new Map([["a", "b"]]))))
            .toEqual([["b", "c"]]);
    });
});