import { arrayCollect } from "./array-collect";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayCollect", () =>
{
    const values = ["a", "b", "c"] as const;

    beforeEach(() => resetDebugState());

    test("| calls the callback with the correct parameters", () =>
    {
        const spy = jest.fn();
        const m = new Map();
        arrayCollect(values, m, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).nthCalledWith(1, m, "a", 0);
        expect(spy).nthCalledWith(2, m, "b", 1);
        expect(spy).nthCalledWith(3, m, "c", 2);
    });

    test("| returns the collect value", () =>
    {
        const m = new Map();
        expect(arrayCollect(values, m, (value) => value)).toEqual(m);
    });
});