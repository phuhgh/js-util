import { arrayBinaryFindInsertionIndex } from "./array-binary-find-insertion-index.js";

describe("=> arrayBinaryFindInsertionIndex", () =>
{
    //         0  1  2  3  4  5  (5 is special, in that no shifting is required)
    const a = [1, 2, 3, 4, 5];

    it("| returns 0 if it is the smallest value", () =>
    {
        expect(arrayBinaryFindInsertionIndex(a, -1, (a, i) => a[i], 5)).toBe(0);
    });

    it("| returns the index to the right where between values", () =>
    {
        expect(arrayBinaryFindInsertionIndex(a, 2.5, (a, i) => a[i], 5)).toBe(2);
    });

    it("| returns the index to the right where between values (special case, last value)", () =>
    {
        expect(arrayBinaryFindInsertionIndex(a, 4.5, (a, i) => a[i], 5)).toBe(4);
    });

    it("| returns length if it is the largest value", () =>
    {
        expect(arrayBinaryFindInsertionIndex(a, 6, (a, i) => a[i], 5)).toBe(5);
    });


    it("| returns the first value where there is an exact match", () =>
    {
        let b = [1, 2, 3, 3, 4, 5];
        expect(arrayBinaryFindInsertionIndex(b, 3, (a, i) => a[i], 5)).toBe(2);
        b = [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5];
        expect(arrayBinaryFindInsertionIndex(b, 3, (a, i) => a[i], 5)).toBe(2);
    });
});