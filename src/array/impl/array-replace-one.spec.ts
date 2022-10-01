import { arrayReplaceOne } from "./array-replace-one.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayReplaceOne", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const a = ["a", "b", "b", "c"];

    it("| replaces a single match from the first argument", () =>
    {
        expect(arrayReplaceOne(a, "b", "e")).toBeTrue();
        expect(a).toEqual(["a", "e", "b", "c"]);
    });
});