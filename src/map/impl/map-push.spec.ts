import { mapPush } from "./map-push";

describe("=> mapPush", () =>
{
    const values = new Map([["a", [1]]]);

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