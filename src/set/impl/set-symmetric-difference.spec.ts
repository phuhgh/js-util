import { setSymmetricDifference } from "./set-symmetric-difference.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> setSymmetricDifference", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns those elements not in the intersection", () =>
    {
        expect(setSymmetricDifference(new Set(["a", "b"]), new Set(["b", "c"])))
            .toEqual(["a", "c"]);
    });
});