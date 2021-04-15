/* tslint:disable:newline-per-chained-call */
import { arrayCollect } from "./array-collect";

describe("=> arrayCollect", () =>
{
    const values = ["a", "b", "c"] as const;

    it("| calls the callback with the correct parameters", () =>
    {
        const spy = jasmine.createSpy();
        const m = new Map();
        arrayCollect(values, m, spy);
        expect(spy.calls.count()).toBe(3);
        expect(spy.calls.argsFor(0)).toEqual([m, "a", 0]);
        expect(spy.calls.argsFor(1)).toEqual([m, "b", 1]);
        expect(spy.calls.argsFor(2)).toEqual([m, "c", 2]);
    });

    it("| returns the collect value", () =>
    {
        const m = new Map();
        expect(arrayCollect(values, m, (value) => value)).toEqual(m);
    });
});