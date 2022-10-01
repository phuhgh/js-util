import { setSetDifference } from "./set-set-difference.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> setSetDifference", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns the difference between A and B", () =>
    {
        expect(setSetDifference(new Set(["a", "b"]), new Set(["b"])))
            .toEqual(["a"]);
    });
});