import { equalityAreConsistentlyDefined } from "./equality-are-consistently-defined";

describe("=> equalityAreConsistentlyDefined", () =>
{
    test("| returns true if both are null", () =>
    {
        expect(equalityAreConsistentlyDefined(null, null)).toBe(true);
    });

    test("| returns true if both are undefined", () =>
    {
        expect(equalityAreConsistentlyDefined(null, null)).toBe(true);
    });

    test("| returns true if both are defined", () =>
    {
        expect(equalityAreConsistentlyDefined(null, null)).toBe(true);
    });

    test("| returns false if mixed", () =>
    {
        expect(equalityAreConsistentlyDefined(null, 0)).toBe(false);
        expect(equalityAreConsistentlyDefined(0, null)).toBe(false);
        expect(equalityAreConsistentlyDefined(undefined, 0)).toBe(false);
        expect(equalityAreConsistentlyDefined(0, undefined)).toBe(false);
    });
});