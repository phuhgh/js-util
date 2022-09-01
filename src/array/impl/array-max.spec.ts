import { arrayMax } from "./array-max.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> arrayMax", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the max", () =>
    {
        expect(arrayMax(new Float32Array([-1, 0, 1]))).toBe(1);
    });
});