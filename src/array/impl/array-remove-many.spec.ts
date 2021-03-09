import { arrayRemoveMany } from "./array-remove-many";
import { debugDescribe } from "../../test-utils";

debugDescribe("=> arrayRemoveMany", () =>
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