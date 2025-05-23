import { arrayCompactMap } from "./array-compact-map.js";
import { _Production } from "../../production/_production.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayCompactMap", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values = ["a", "b", "c"] as const;

    it("| calls the callback with the correct parameters", () =>
    {
        const spy = jasmine.createSpy();
        arrayCompactMap(values, spy);
        expect(spy.calls.count()).toBe(3);
        expect(spy.calls.argsFor(0)).toEqual(["a", 0]);
        expect(spy.calls.argsFor(1)).toEqual(["b", 1]);
        expect(spy.calls.argsFor(2)).toEqual(["c", 2]);
    });

    it("| returns the mapped result", () =>
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