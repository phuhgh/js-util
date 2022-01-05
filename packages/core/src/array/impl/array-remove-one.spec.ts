import { arrayRemoveOne } from "./array-remove-one";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayRemoveOne", () =>
{
    beforeEach(() => resetDebugState());

    test("| removes a single match from the first argument", () =>
    {
        const a = ["a", "b", "b", "c"];
        expect(arrayRemoveOne(a, "b")).toBe(true);
        expect(a).toEqual(["a", "b", "c"]);
    });

    test("| returns false when nothing is removed", () =>
    {
        const a = ["a", "b", "b", "c"];
        expect(arrayRemoveOne(a, "f")).toBe(false);
    });
});