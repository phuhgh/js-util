import { arraySetDifference } from "./array-set-difference";
import { setDefaultUnitTestFlags } from "../../test-utils";

describe("=> arraySetDifference", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the difference between A and B", () =>
    {
        expect(Array.from(arraySetDifference(["a", "b"], new Set(["b"])).values()))
            .toEqual(["a"]);
    });
});