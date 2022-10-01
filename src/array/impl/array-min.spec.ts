import { arrayMin } from "./array-min.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayMin", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns the min", () =>
    {
        expect(arrayMin(new Float32Array([-1, 0, 1]))).toBe(-1);
    });
});