/* tslint:disable:newline-per-chained-call */
import { arrayRemoveOne } from "./array-remove-one";

describe("=> arrayRemoveOne", () =>
{
    const a = ["a", "b", "b", "c"];

    it("| removes a single match from the first argument", () =>
    {
        arrayRemoveOne(a, "b");
        expect(a).toEqual(["a", "b", "c"]);
    });
});