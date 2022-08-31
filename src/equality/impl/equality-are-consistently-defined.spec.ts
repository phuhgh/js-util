import { equalityAreConsistentlyDefined } from "./equality-are-consistently-defined";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> equalityAreConsistentlyDefined", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
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