import { mapSetDifference } from "./map-set-difference";
import { setDefaultUnitTestFlags } from "../../test-utils";

describe("=> mapSetDifference", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the difference", () =>
    {
        expect(Array.from(mapSetDifference(new Map([["a", "b"], ["b", "c"]]), new Map([["a", "b"]]))))
            .toEqual([["b", "c"]]);
    });
});