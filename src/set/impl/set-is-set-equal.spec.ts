import { setIsSetEqual } from "./set-is-set-equal";
import { setDefaultUnitTestFlags } from "../../test-utils";

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