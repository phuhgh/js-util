import { arrayFlatMap } from "./array-flat-map";
import { _Production } from "../../production/_production";
import { debugDescribe } from "../../test-utils";

debugDescribe("=> arrayFlatMap", () =>
{
    const values = ["a", "b", "c", "d"] as const;

    it("| calls the callback with the correct parameters", () =>
    {
        const spy = jasmine.createSpy();
        spy.and.returnValue(null);
        arrayFlatMap(values, spy);
        expect(spy.calls.count()).toBe(4);
        expect(spy.calls.argsFor(0)).toEqual(["a", 0]);
        expect(spy.calls.argsFor(1)).toEqual(["b", 1]);
        expect(spy.calls.argsFor(2)).toEqual(["c", 2]);
        expect(spy.calls.argsFor(3)).toEqual(["d", 3]);
    });

    it("| returns the mapped result", () =>
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