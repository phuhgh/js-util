import { arrayContains } from "./array-contains";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> arrayContains", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("returns true if present", () =>
    {
        expect(arrayContains([1, 2, 3], 3)).toBeTrue();
    });
    it("returns false if present", () =>
    {
        expect(arrayContains([1, 2, 3], 4)).toBeFalse();
    });
});