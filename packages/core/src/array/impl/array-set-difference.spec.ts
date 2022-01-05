import { arraySetDifference } from "./array-set-difference";

describe("=> arraySetDifference", () =>
{
    test("| returns the difference between A and B", () =>
    {
        expect(Array.from(arraySetDifference(["a", "b"], new Set(["b"])).values()))
            .toEqual(["a"]);
    });
});