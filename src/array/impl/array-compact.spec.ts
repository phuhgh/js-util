import { arrayCompact } from "./array-compact.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayCompact", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values = ["a", "b", null, undefined] as const;

    it("| returns an array minus null and undefined", () =>
    {
        const result: ("a" | "b")[] = arrayCompact(values);
        expect(result).toEqual(["a", "b"]);
    });
});