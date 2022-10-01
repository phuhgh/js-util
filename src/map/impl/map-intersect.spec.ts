import { mapIntersect } from "./map-intersect.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mapIntersect", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns the intersection", () =>
    {
        expect(Array.from(mapIntersect(new Map([["a", "b"]]), new Map([["a", "b"], ["b", "c"]]))))
            .toEqual([["a", "b"]]);
    });
});