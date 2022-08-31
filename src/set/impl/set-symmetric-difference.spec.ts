import { setSymmetricDifference } from "./set-symmetric-difference";
import { setDefaultUnitTestFlags } from "../../test-utils";

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