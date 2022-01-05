import { mapArrayMap } from "./map-array-map";
import { resetDebugState } from "@rc-js-util/test";

describe("=> mapArrayMap", () =>
{
    const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);

    beforeEach(() => resetDebugState());

    test("| calls the callback with the correct parameters", () =>
    {
        const spy = jest.fn();
        spy.mockReturnValue(null);
        mapArrayMap(values, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).nthCalledWith(1, 1, "a");
        expect(spy).nthCalledWith(2, 2, "b");
        expect(spy).nthCalledWith(3, 3, "c");
    });

    test("| returns the mapped values", () =>
    {
        const result: (1 | 2 | 3)[] = mapArrayMap(values, (value) => value);
        expect(result).toEqual([1, 2, 3]);
    });
});