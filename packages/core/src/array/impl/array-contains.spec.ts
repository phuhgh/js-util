import { arrayContains } from "./array-contains";

describe("=> arrayContains", () =>
{
    test("| returns true if present", () =>
    {
        expect(arrayContains([1, 2, 3], 3)).toBe(true);
    });
    test("| returns false if present", () =>
    {
        expect(arrayContains([1, 2, 3], 4)).toBe(false);
    });
});