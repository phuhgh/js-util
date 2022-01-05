import { equalityAllEqual } from "./equality-all-equal";

describe("=> equalityAllEqual", () =>
{
    test("| returns false when items are different", () =>
    {
        expect(equalityAllEqual([[], 0, "", false])).toBe(false);
        expect(equalityAllEqual([1, 0, 1])).toBe(false);
        expect(equalityAllEqual([0, 1, 0])).toBe(false);
    });

    test("| returns true when items are the same", () =>
    {
        expect(equalityAllEqual([0, 0, 0, 0])).toBe(true);
        expect(equalityAllEqual([1, 1, 1, 1])).toBe(true);
        expect(equalityAllEqual(new Uint32Array(8))).toBe(true);
    });
});