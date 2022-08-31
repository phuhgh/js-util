import { arrayCompactMap } from "./array-compact-map";
import { _Production } from "../../production/_production";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> arrayCompactMap", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
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