import { mapSymmetricDifference } from "./map-symmetric-difference.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mapSymmetricDifference", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns items not in the intersection", () =>
    {
        expect(Array.from(mapSymmetricDifference(new Map([["a", "b"], ["b", "c"]]), new Map([["a", "b"], ["d", "e"]]))))
            .toEqual([["b", "c"], ["d", "e"]]);
    });
});