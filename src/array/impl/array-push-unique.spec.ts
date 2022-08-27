import { arrayPushUnique } from "./array-push-unique";
import { setDefaultUnitTestFlags } from "../../test-utils";

describe("=> arrayPushUnique", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
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