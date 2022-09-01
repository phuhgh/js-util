import { arrayRemoveOne } from "./array-remove-one.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> arrayRemoveOne", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| removes a single match from the first argument", () =>
    {
        const a = ["a", "b", "b", "c"];
        expect(arrayRemoveOne(a, "b")).toBe(true);
        expect(a).toEqual(["a", "b", "c"]);
    });

    it("| returns false when nothing is removed", () =>
    {
        const a = ["a", "b", "b", "c"];
        expect(arrayRemoveOne(a, "f")).toBe(false);
    });
});