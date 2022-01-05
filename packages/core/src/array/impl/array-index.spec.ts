import { arrayIndex } from "./array-index";
import { _Production } from "../../production/_production";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayIndex", () =>
{
    const values = ["a", "b", "c"] as const;

    beforeEach(() => resetDebugState());

    test("| calls the callback with the correct parameters", () =>
    {
        const spy = jest.fn();
        spy.mockReturnValue(null);
        arrayIndex(values, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).nthCalledWith(1, "a", 0);
        expect(spy).nthCalledWith(2, "b", 1);
        expect(spy).nthCalledWith(3, "c", 2);
    });

    test("| returns the indexed result", () =>
    {
        const result = arrayIndex(values, (value) =>
        {
            switch (value)
            {
                case "a":
                    return null;
                case "b":
                    return undefined;
                case "c":
                    return "d";
                default:
                    return _Production.assertValueIsNever(value);
            }
        });

        expect(result.size).toEqual(2);
        expect(result.get(undefined)).toEqual("b");
        expect(result.get("d")).toEqual("c");
    });
});