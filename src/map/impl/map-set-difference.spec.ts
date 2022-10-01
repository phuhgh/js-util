import { mapSetDifference } from "./map-set-difference.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> mapSetDifference", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns the difference", () =>
    {
        expect(Array.from(mapSetDifference(new Map([["a", "b"], ["b", "c"]]), new Map([["a", "b"]]))))
            .toEqual([["b", "c"]]);
    });
});