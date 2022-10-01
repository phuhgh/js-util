import { arraySetDifference } from "./array-set-difference.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arraySetDifference", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns the difference between A and B", () =>
    {
        expect(Array.from(arraySetDifference(["a", "b"], new Set(["b"])).values()))
            .toEqual(["a"]);
    });
});