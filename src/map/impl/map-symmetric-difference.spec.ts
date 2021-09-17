import { mapSymmetricDifference } from "./map-symmetric-difference";

describe("=> mapSymmetricDifference", () =>
{
    it("| returns items not in the intersection", () =>
    {
        expect(Array.from(mapSymmetricDifference(new Map([["a", "b"], ["b", "c"]]), new Map([["a", "b"], ["d", "e"]]))))
            .toEqual([["b", "c"], ["d", "e"]]);
    });
});