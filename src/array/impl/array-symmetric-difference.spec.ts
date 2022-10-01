import { arraySymmetricDifference } from "./array-symmetric-difference.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arraySymmetricDifference", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns those elements not in the intersection", () =>
    {
        expect(Array.from(arraySymmetricDifference(["a", "b"], ["b", "c"]).values()))
            .toEqual(["a", "c"]);
    });
});