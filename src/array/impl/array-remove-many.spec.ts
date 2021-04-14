/* tslint:disable:newline-per-chained-call */
import { arrayRemoveMany } from "./array-remove-many";

describe("=> arrayRemoveMany", () =>
{
    const a = ["a", "b", "c"];
    const b = ["b"];

    it("| removes matches from the first argument", () =>
    {
        arrayRemoveMany(a, b);
        expect(a).toEqual(["a", "c"]);
        expect(b).toEqual(["b"]);
    });
});