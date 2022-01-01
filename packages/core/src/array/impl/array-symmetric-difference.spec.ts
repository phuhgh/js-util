import { arraySymmetricDifference } from "./array-symmetric-difference";

describe("=> arraySymmetricDifference", () =>
{
    it("| returns those elements not in the intersection", () =>
    {
        expect(Array.from(arraySymmetricDifference(["a", "b"], ["b", "c"]).values()))
            .toEqual(["a", "c"]);
    });
});