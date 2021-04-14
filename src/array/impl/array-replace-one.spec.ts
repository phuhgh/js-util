/* tslint:disable:newline-per-chained-call */
import { arrayReplaceOne } from "./array-replace-one";

describe("=> arrayReplaceOne", () =>
{
    const a = ["a", "b", "b", "c"];

    it("| replaces a single match from the first argument", () =>
    {
        arrayReplaceOne(a, "b", "e");
        expect(a).toEqual(["a", "e", "b", "c"]);
    });
});