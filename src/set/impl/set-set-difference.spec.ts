import { setSetDifference } from "./set-set-difference.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> setSetDifference", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the difference between A and B", () =>
    {
        expect(setSetDifference(new Set(["a", "b"]), new Set(["b"])))
            .toEqual(["a"]);
    });
});