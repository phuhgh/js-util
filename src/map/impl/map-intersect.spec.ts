import { mapIntersect } from "./map-intersect";

describe("=> mapIntersect", () =>
{
    it("| returns the intersection", () =>
    {
        expect(Array.from(mapIntersect(new Map([["a", "b"]]), new Map([["a", "b"], ["b", "c"]]))))
            .toEqual([["a", "b"]]);
    });
});