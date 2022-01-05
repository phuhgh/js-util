import { arrayForEach } from "./array-for-each";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayForEach", () =>
{
    const values = ["a", "b", "c", "d"] as const;

    beforeEach(() => resetDebugState());

    test("| calls the callback with the correct parameters", () =>
    {
        const spy = jest.fn();
        spy.mockReturnValue(null);
        arrayForEach(values, spy);
        expect(spy).toHaveBeenCalledTimes(4);
        expect(spy).nthCalledWith(1, "a", 0);
        expect(spy).nthCalledWith(2, "b", 1);
        expect(spy).nthCalledWith(3, "c", 2);
        expect(spy).nthCalledWith(4, "d", 3);
    });
});