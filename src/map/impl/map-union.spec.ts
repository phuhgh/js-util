import { mapUnion } from "./map-union.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mapUnion", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns the union", () =>
    {
        expect(Array.from(mapUnion(new Map([["a", "b"], ["b", "c"]]), new Map([["d", "e"]]))))
            .toEqual([["a", "b"], ["b", "c"], ["d", "e"]]);
    });
});