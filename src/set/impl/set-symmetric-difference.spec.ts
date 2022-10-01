import { setSymmetricDifference } from "./set-symmetric-difference.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> setSymmetricDifference", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns those elements not in the intersection", () =>
    {
        expect(setSymmetricDifference(new Set(["a", "b"]), new Set(["b", "c"])))
            .toEqual(["a", "c"]);
    });
});