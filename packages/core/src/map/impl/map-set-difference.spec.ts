import { mapSetDifference } from "./map-set-difference";

describe("=> mapSetDifference", () =>
{
    test("| returns the difference", () =>
    {
        expect(Array.from(mapSetDifference(new Map([["a", "b"], ["b", "c"]]), new Map([["a", "b"]]))))
            .toEqual([["b", "c"]]);
    });
});