import { arrayContains } from "./array-contains";

describe("=> arrayContains", () =>
{
    it("returns true if present", () =>
    {
        expect(arrayContains([1, 2, 3], 3)).toBeTrue();
    });
    it("returns false if present", () =>
    {
        expect(arrayContains([1, 2, 3], 4)).toBeFalse();
    });
});