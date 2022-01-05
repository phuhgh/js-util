import { arrayRemoveMany } from "./array-remove-many";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayRemoveMany", () =>
{
    beforeEach(() => resetDebugState());

    test("| removes matches from the first argument", () =>
    {
        const a = ["a", "b", "c"];
        const b = ["b", "d"];

        expect(arrayRemoveMany(a, b)).toBe(1);
        expect(a).toEqual(["a", "c"]);
        expect(b).toEqual(["b", "d"]);
    });
});