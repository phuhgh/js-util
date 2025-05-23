import { arrayForEach } from "./array-for-each.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayForEach", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values = ["a", "b", "c", "d"] as const;

    it("| calls the callback with the correct parameters", () =>
    {
        const spy = jasmine.createSpy();
        spy.and.returnValue(null);
        arrayForEach(values, spy);
        expect(spy.calls.count()).toBe(4);
        expect(spy.calls.argsFor(0)).toEqual(["a", 0]);
        expect(spy.calls.argsFor(1)).toEqual(["b", 1]);
        expect(spy.calls.argsFor(2)).toEqual(["c", 2]);
        expect(spy.calls.argsFor(3)).toEqual(["d", 3]);
    });
});