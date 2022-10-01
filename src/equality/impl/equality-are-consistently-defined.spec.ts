import { equalityAreConsistentlyDefined } from "./equality-are-consistently-defined.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> equalityAreConsistentlyDefined", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns true if both are null", () =>
    {
        expect(equalityAreConsistentlyDefined(null, null)).toBe(true);
    });

    it("| returns true if both are undefined", () =>
    {
        expect(equalityAreConsistentlyDefined(null, null)).toBe(true);
    });

    it("| returns true if both are defined", () =>
    {
        expect(equalityAreConsistentlyDefined(null, null)).toBe(true);
    });

    it("| returns false if mixed", () =>
    {
        expect(equalityAreConsistentlyDefined(null, 0)).toBe(false);
        expect(equalityAreConsistentlyDefined(0, null)).toBe(false);
        expect(equalityAreConsistentlyDefined(undefined, 0)).toBe(false);
        expect(equalityAreConsistentlyDefined(0, undefined)).toBe(false);
    });
});