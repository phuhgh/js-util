import { setIsSetEqual } from "./set-is-set-equal.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> setIsSetEqual", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns true if the items are the same", () =>
    {
        expect(setIsSetEqual(new Set(["a"]), new Set(["a"]))).toBe(true);
    });

    it("| returns false if the items are the same", () =>
    {
        expect(setIsSetEqual(new Set(["a"]), new Set(["a", "b"]))).toBe(false);
    });
});