/* tslint:disable:newline-per-chained-call */
import { arrayIndex } from "./array-index";
import { _Assert } from "../../assert/_assert";

describe("=> arrayIndex", () =>
{
    const values = ["a", "b", "c"] as const;

    it("| calls the callback with the correct parameters", () =>
    {
        const spy = jasmine.createSpy();
        spy.and.returnValue(null);
        arrayIndex(values, spy);
        expect(spy.calls.count()).toBe(3);
        expect(spy.calls.argsFor(0)).toEqual(["a", 0]);
        expect(spy.calls.argsFor(1)).toEqual(["b", 1]);
        expect(spy.calls.argsFor(2)).toEqual(["c", 2]);
    });

    it("| returns the indexed result", () =>
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
                    return _Assert.valueIsNever(value);
            }
        });

        expect(result.size).toEqual(2);
        expect(result.get(undefined)).toEqual("b");
        expect(result.get("d")).toEqual("c");
    });
});