import { arrayMax } from "./array-max.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayMax", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns the max", () =>
    {
        expect(arrayMax(new Float32Array([-1, 0, 1]))).toBe(1);
    });
});