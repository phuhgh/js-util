import { arrayInsertAtIndex } from "./array-insert-at-index";

describe("=> arrayInsertAtIndex", () =>
{
    test("| returns the expected index", () =>
    {
        const a = [1, 2, 3];
        arrayInsertAtIndex(a, 5, 1);
        expect(a).toEqual([1, 5, 2, 3]);
    });
});