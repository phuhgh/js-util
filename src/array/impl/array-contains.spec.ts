import { arrayContains } from "./array-contains.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayContains", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("returns true if present", () =>
    {
        expect(arrayContains([1, 2, 3], 3)).toBeTrue();
    });
    it("returns false if present", () =>
    {
        expect(arrayContains([1, 2, 3], 4)).toBeFalse();
    });
});