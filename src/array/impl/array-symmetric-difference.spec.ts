import { arraySymmetricDifference } from "./array-symmetric-difference";
import { setDefaultUnitTestFlags } from "../../test-utils";

describe("=> arraySymmetricDifference", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns those elements not in the intersection", () =>
    {
        expect(Array.from(arraySymmetricDifference(["a", "b"], ["b", "c"]).values()))
            .toEqual(["a", "c"]);
    });
});