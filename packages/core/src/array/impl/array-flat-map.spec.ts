import { arrayFlatMap } from "./array-flat-map";
import { _Production } from "../../production/_production";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayFlatMap", () =>
{
    const values = ["a", "b", "c", "d"] as const;

    beforeEach(() => resetDebugState());

    test("| calls the callback with the correct parameters", () =>
    {
        const spy = jest.fn();
        spy.mockReturnValue(null);
        arrayFlatMap(values, spy);
        expect(spy).toHaveBeenCalledTimes(4);
        expect(spy).nthCalledWith(1, "a", 0);
        expect(spy).nthCalledWith(2, "b", 1);
        expect(spy).nthCalledWith(3, "c", 2);
        expect(spy).nthCalledWith(4, "d", 3);
    });

    test("| returns the mapped result", () =>
    {
        const result: ("d" | null | undefined)[] = arrayFlatMap(values, (value) =>
        {
            switch (value)
            {
                case "a":
                    return [null];
                case "b":
                    return [undefined];
                case "c":
                    return null;
                case "d":
                    return ["d"] as const;
                default:
                    return _Production.assertValueIsNever(value);
            }
        });

        expect(result).toEqual([null, undefined, "d"]);
    });
});