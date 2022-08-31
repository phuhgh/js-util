import { mapSymmetricDifference } from "./map-symmetric-difference";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> mapSymmetricDifference", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns items not in the intersection", () =>
    {
        expect(Array.from(mapSymmetricDifference(new Map([["a", "b"], ["b", "c"]]), new Map([["a", "b"], ["d", "e"]]))))
            .toEqual([["b", "c"], ["d", "e"]]);
    });
});