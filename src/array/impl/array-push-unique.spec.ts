/* tslint:disable:newline-per-chained-call */
import { arrayPushUnique } from "./array-push-unique";

describe("=> arrayPushUnique", () =>
{
    it("| pushes if unique", () =>
    {
        const values = ["a", "b", "c"];
        arrayPushUnique(values, "d", (value) => value);
        expect(values).toEqual(["a", "b", "c", "d"]);
    });

    it("| doesn't push if not unique", () =>
    {
        const values = ["a", "b", "c"];
        arrayPushUnique(values, "c", (value) => value);
        expect(values).toEqual(["a", "b", "c"]);
    });

    it("| uses strict null undefined comparison", () =>
    {
        const values: (string | null | undefined)[] = ["a", null, "c"];
        arrayPushUnique(values, undefined, (value) => value);
        expect(values).toEqual(["a", null, "c", undefined]);
    });
});