import { mapIntersect } from "./map-intersect";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> mapIntersect", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the intersection", () =>
    {
        expect(Array.from(mapIntersect(new Map([["a", "b"]]), new Map([["a", "b"], ["b", "c"]]))))
            .toEqual([["a", "b"]]);
    });
});