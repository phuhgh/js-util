import { arrayPushUnique } from "./array-push-unique";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayPushUnique", () =>
{
    beforeEach(() => resetDebugState());

    test("| pushes if unique", () =>
    {
        const values = ["a", "b", "c"];
        expect(arrayPushUnique(values, "d", (value) => value)).toBe(true);
        expect(values).toEqual(["a", "b", "c", "d"]);
    });

    test("| doesn't push if not unique", () =>
    {
        const values = ["a", "b", "c"];
        expect(arrayPushUnique(values, "c", (value) => value)).toBe(false);
        expect(values).toEqual(["a", "b", "c"]);
    });

    test("| uses strict null undefined comparison", () =>
    {
        const values: (string | null | undefined)[] = ["a", null, "c"];
        arrayPushUnique(values, undefined, (value) => value);
        expect(values).toEqual(["a", null, "c", undefined]);
    });
});