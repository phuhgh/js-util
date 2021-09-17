import { setSetDifference } from "./set-set-difference";

describe("=> setSetDifference", () =>
{
    it("| returns the difference between A and B", () =>
    {
        expect(setSetDifference(new Set(["a", "b"]), new Set(["b"])))
            .toEqual(["a"]);
    });
});