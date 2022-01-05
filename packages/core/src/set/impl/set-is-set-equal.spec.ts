import { setIsSetEqual } from "./set-is-set-equal";

describe("=> setIsSetEqual", () =>
{
    test("| returns true if the items are the same", () =>
    {
        expect(setIsSetEqual(new Set(["a"]), new Set(["a"]))).toBe(true);
    });

    test("| returns false if the items are the same", () =>
    {
        expect(setIsSetEqual(new Set(["a"]), new Set(["a", "b"]))).toBe(false);
    });
});