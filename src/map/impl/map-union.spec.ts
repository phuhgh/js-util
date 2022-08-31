import { mapUnion } from "./map-union";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> mapUnion", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the union", () =>
    {
        expect(Array.from(mapUnion(new Map([["a", "b"], ["b", "c"]]), new Map([["d", "e"]]))))
            .toEqual([["a", "b"], ["b", "c"], ["d", "e"]]);
    });
});