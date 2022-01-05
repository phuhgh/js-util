import { _Set } from "../../set/_set";
import { mapDeleteFromSet } from "./map-delete-from-set";
import { resetDebugState } from "@rc-js-util/test";

describe("=> mapDeleteFromSet", () =>
{
    const values = new Map([["a", new Set([1])]]);

    beforeEach(() => resetDebugState());

    test("| deletes where set exists and value is present", () =>
    {
        mapDeleteFromSet(values, "a", 1);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(_Set.valuesToArray(values.get("a")!)).toEqual([]);
    });
});