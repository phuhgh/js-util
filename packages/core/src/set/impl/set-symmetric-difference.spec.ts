import { setSymmetricDifference } from "./set-symmetric-difference";

describe("=> setSymmetricDifference", () =>
{
    test("| returns those elements not in the intersection", () =>
    {
        expect(setSymmetricDifference(new Set(["a", "b"]), new Set(["b", "c"])))
            .toEqual(["a", "c"]);
    });
});