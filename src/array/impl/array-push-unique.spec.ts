import { arrayPushUnique } from "./array-push-unique.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayPushUnique", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| pushes if unique", () =>
    {
        const values = ["a", "b", "c"];
        expect(arrayPushUnique(values, "d", (value) => value)).toBeTrue();
        expect(values).toEqual(["a", "b", "c", "d"]);
    });

    it("| doesn't push if not unique", () =>
    {
        const values = ["a", "b", "c"];
        expect(arrayPushUnique(values, "c", (value) => value)).toBeFalse();
        expect(values).toEqual(["a", "b", "c"]);
    });

    it("| uses strict null undefined comparison", () =>
    {
        const values: (string | null | undefined)[] = ["a", null, "c"];
        arrayPushUnique(values, undefined, (value) => value);
        expect(values).toEqual(["a", null, "c", undefined]);
    });
});