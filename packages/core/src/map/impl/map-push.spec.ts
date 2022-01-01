import { mapPush } from "./map-push";
import { resetDebugState } from "@rc-js-util/test";

describe("=> mapPush", () =>
{
    const values = new Map([["a", [1]]]);

    beforeEach(() => resetDebugState());

    it("| pushes where array exists", () =>
    {
        mapPush(values, "a", 2);
        expect(values.get("a")).toEqual([1, 2]);
    });

    it("| creates array where key not defined", () =>
    {
        mapPush(values, "b", 3);
        expect(values.get("b")).toEqual([3]);
    });
});