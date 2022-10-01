import { setIsSetEqual } from "./set-is-set-equal.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> setIsSetEqual", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns true if the items are the same", () =>
    {
        expect(setIsSetEqual(new Set(["a"]), new Set(["a"]))).toBe(true);
    });

    it("| returns false if the items are the same", () =>
    {
        expect(setIsSetEqual(new Set(["a"]), new Set(["a", "b"]))).toBe(false);
    });
});