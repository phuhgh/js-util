import { arrayCompact } from "./array-compact";
import { debugDescribe } from "../../test-utils";

debugDescribe("=> arrayCompact", () =>
{
    const values = ["a", "b", null, undefined] as const;

    it("| returns an array minus null and undefined", () =>
    {
        const result: ("a" | "b")[] = arrayCompact(values);
        expect(result).toEqual(["a", "b"]);
    });
});