import { equalityAllEqual } from "./equality-all-equal";
import { setDefaultUnitTestFlags } from "../../test-utils";

describe("=> equalityAllEqual", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns false when items are different", () =>
    {
        expect(equalityAllEqual([[], 0, "", false])).toBeFalse();
        expect(equalityAllEqual([1, 0, 1])).toBeFalse();
        expect(equalityAllEqual([0, 1, 0])).toBeFalse();
    });

    it("| returns true when items are the same", () =>
    {
        expect(equalityAllEqual([0, 0, 0, 0])).toBeTrue();
        expect(equalityAllEqual([1, 1, 1, 1])).toBeTrue();
        expect(equalityAllEqual(new Uint32Array(8))).toBeTrue();
    });
});