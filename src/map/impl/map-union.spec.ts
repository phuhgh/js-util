import { mapUnion } from "./map-union";

describe("=> mapUnion", () =>
{
    it("| returns the union", () =>
    {
        expect(Array.from(mapUnion(new Map([["a", "b"], ["b", "c"]]), new Map([["d", "e"]]))))
            .toEqual([["a", "b"], ["b", "c"], ["d", "e"]]);
    });
});