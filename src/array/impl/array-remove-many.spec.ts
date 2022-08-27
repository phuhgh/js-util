import { arrayRemoveMany } from "./array-remove-many";
import { setDefaultUnitTestFlags } from "../../test-utils";

describe("=> arrayRemoveMany", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
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