import { arrayRemoveMany } from "./array-remove-many";
import { debugDescribe } from "../../test-utils";

debugDescribe("=> arrayRemoveMany", () =>
{
    it("| removes matches from the first argument", () =>
    {
        const a = ["a", "b", "c"];
        const b = ["b", "d"];

        expect(arrayRemoveMany(a, b)).toBe(1) ;
        expect(a).toEqual(["a", "c"]);
        expect(b).toEqual(["b", "d"]);
    });
});