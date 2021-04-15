/* tslint:disable:newline-per-chained-call */
import { arrayCopyInto } from "./array-copy-into";

describe("=> arrayCopyInto", () =>
{
    const a = ["d", "e"];
    const b = ["a", "b", "c"];

    it("| writes the values of the first argument into the second", () =>
    {
        arrayCopyInto(a, b);

        expect(a).toEqual(["d", "e"]);
        expect(b).toEqual(["d", "e"]);
    });
});