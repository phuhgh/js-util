import { arrayReplaceOne } from "./array-replace-one";
import { debugDescribe } from "../../test-utils";

debugDescribe("=> arrayReplaceOne", () =>
{
    const a = ["a", "b", "b", "c"];

    it("| replaces a single match from the first argument", () =>
    {
        arrayReplaceOne(a, "b", "e");
        expect(a).toEqual(["a", "e", "b", "c"]);
    });
});