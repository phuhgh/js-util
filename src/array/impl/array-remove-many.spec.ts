import { arrayRemoveMany } from "./array-remove-many.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayRemoveMany", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| removes matches from the first argument", () =>
    {
        const a = ["a", "b", "c"];
        const b = ["b", "d"];

        expect(arrayRemoveMany(a, b)).toBe(1);
        expect(a).toEqual(["a", "c"]);
        expect(b).toEqual(["b", "d"]);
    });
});