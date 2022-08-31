import { arrayMin } from "./array-min";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> arrayMin", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the min", () =>
    {
        expect(arrayMin(new Float32Array([-1, 0, 1]))).toBe(-1);
    });
});