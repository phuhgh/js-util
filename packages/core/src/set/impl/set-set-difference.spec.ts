import { setSetDifference } from "./set-set-difference";

describe("=> setSetDifference", () =>
{
    test("| returns the difference between A and B", () =>
    {
        expect(setSetDifference(new Set(["a", "b"]), new Set(["b"])))
            .toEqual(["a"]);
    });
});