import { mapAddToSet } from "./map-add-to-set";
import { _Set } from "../../set/_set";
import { resetDebugState } from "@rc-js-util/test";

describe("=> mapAddToSet", () =>
{
    const values = new Map([["a", new Set([1])]]);

    beforeEach(() => resetDebugState());

    it("| adds where set exists", () =>
    {
        mapAddToSet(values, "a", 2);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(_Set.valuesToArray(values.get("a")!)).toEqual([1, 2]);
    });

    it("| creates array where key not defined", () =>
    {
        mapAddToSet(values, "b", 3);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(_Set.valuesToArray(values.get("b")!)).toEqual([3]);
    });
});