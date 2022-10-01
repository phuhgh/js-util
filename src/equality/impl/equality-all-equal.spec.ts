import { equalityAllEqual } from "./equality-all-equal.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> equalityAllEqual", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns false when items are different", () =>
    {
        expect(equalityAllEqual([[], 0, "", false])).toBeFalse();
        expect(equalityAllEqual([1, 0, 1])).toBeFalse();
        expect(equalityAllEqual([0, 1, 0])).toBeFalse();
    });

    it("| returns true when items are the same", () =>
    {
        expect(equalityAllEqual([0, 0, 0, 0])).toBeTrue();
        expect(equalityAllEqual([1, 1, 1, 1])).toBeTrue();
        expect(equalityAllEqual(new Uint32Array(8))).toBeTrue();
    });
});