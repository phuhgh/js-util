import { arrayCompactMap } from "./array-compact-map";
import { _Production } from "../../production/_production";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayCompactMap", () =>
{
    const values = ["a", "b", "c"] as const;

    beforeEach(() => resetDebugState());

    test("| calls the callback with the correct parameters", () =>
    {
        const spy = jest.fn();
        arrayCompactMap(values, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).nthCalledWith(1, "a", 0);
        expect(spy).nthCalledWith(2, "b", 1);
        expect(spy).nthCalledWith(3, "c", 2);
    });

    test("| returns the mapped result", () =>
    {
        const result = arrayCompactMap(values, (value) =>
        {
            switch (value)
            {
                case "a":
                    return "a";
                case "b":
                    return undefined;
                case "c":
                    return null;
                default:
                    return _Production.assertValueIsNever(value);
            }
        });

        expect(result).toEqual(["a", undefined]);
    });
});