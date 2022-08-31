import { arraySymmetricDifference } from "./array-symmetric-difference";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

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