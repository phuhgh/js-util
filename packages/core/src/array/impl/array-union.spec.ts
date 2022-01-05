import { arrayIntersect } from "./array-intersect";
import { arrayUnion } from "./array-union";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayUnion", () =>
{
    const a = ["a", "b", "c"] as const;
    const b = ["a", "d", "e"] as const;

    beforeEach(() => resetDebugState());

    test("| calls the callback with the correct parameters", () =>
    {
        const spy = jest.fn();
        spy.mockReturnValue(null);
        arrayIntersect(a, b, spy);
        expect(spy).toHaveBeenCalledTimes(6);
        // call order not important, only arguments
        expect(spy).nthCalledWith(1, "a", 0);
        expect(spy).nthCalledWith(2, "d", 1);
        expect(spy).nthCalledWith(3, "e", 2);
        expect(spy).nthCalledWith(4, "a", 0);
        expect(spy).nthCalledWith(5, "b", 1);
        expect(spy).nthCalledWith(6, "c", 2);
    });

    test("| returns the union", () =>
    {
        const result: ("a" | "b" | "c" | "d" | "e")[] = arrayUnion([a, b], (value) => value);

        expect(result).toEqual(["a", "b", "c", "d", "e"]);
    });
});