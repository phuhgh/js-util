import { arrayMap } from "./array-map.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayMap", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values = ["a", "b", "c"] as const;

    it("| calls the callback with the correct parameters", () =>
    {
        const spy = jasmine.createSpy();
        arrayMap(values, spy);
        expect(spy.calls.count()).toBe(3);
        expect(spy.calls.argsFor(0)).toEqual(["a", 0]);
        expect(spy.calls.argsFor(1)).toEqual(["b", 1]);
        expect(spy.calls.argsFor(2)).toEqual(["c", 2]);
    });

    it("| returns the mapped result", () =>
    {
        expect(arrayMap(values, (value) => value + "a")).toEqual(["aa", "ba", "ca"]);
    });
});