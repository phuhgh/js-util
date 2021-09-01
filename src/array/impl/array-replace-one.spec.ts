import { arrayReplaceOne } from "./array-replace-one";
import { debugDescribe } from "../../test-utils";

debugDescribe("=> arrayReplaceOne", () =>
{
    const a = ["a", "b", "b", "c"];

    it("| replaces a single match from the first argument", () =>
    {
        expect(arrayReplaceOne(a, "b", "e")).toBeTrue();
        expect(a).toEqual(["a", "e", "b", "c"]);
    });
});