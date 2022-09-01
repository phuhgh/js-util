import { arrayIntersect } from "./array-intersect.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> arrayIntersect", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    const a = ["a", "b", "c"] as const;
    const b = ["a", "d", "e"] as const;

    it("| calls the callback with the correct parameters", () =>
    {
        const spy = jasmine.createSpy();
        spy.and.returnValue(null);
        arrayIntersect(a, b, spy);
        expect(spy.calls.count()).toBe(6);
        // call order not important, only arguments
        expect(spy.calls.argsFor(0)).toEqual(["a", 0]);
        expect(spy.calls.argsFor(1)).toEqual(["d", 1]);
        expect(spy.calls.argsFor(2)).toEqual(["e", 2]);
        expect(spy.calls.argsFor(3)).toEqual(["a", 0]);
        expect(spy.calls.argsFor(4)).toEqual(["b", 1]);
        expect(spy.calls.argsFor(5)).toEqual(["c", 2]);
    });

    it("| returns the intersection", () =>
    {
        const result: ("a" | "b" | "c" | "d" | "e")[] = arrayIntersect(a, b, (value) => value);

        expect(result).toEqual(["a"]);
    });
});