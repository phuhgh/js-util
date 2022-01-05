import { arrayMap } from "./array-map";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayMap", () =>
{
    const values = ["a", "b", "c"] as const;

    beforeEach(() => resetDebugState());

    test("| calls the callback with the correct parameters", () =>
    {
        const spy = jest.fn();
        arrayMap(values, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).nthCalledWith(1, "a", 0);
        expect(spy).nthCalledWith(2, "b", 1);
        expect(spy).nthCalledWith(3, "c", 2);
    });

    test("| returns the mapped result", () =>
    {
        expect(arrayMap(values, (value) => value + "a")).toEqual(["aa", "ba", "ca"]);
    });
});