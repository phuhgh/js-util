import { mapArrayMap } from "./map-array-map";
import { setDefaultUnitTestFlags } from "../../test-utils";

describe("=> mapArrayMap", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);

    it("| calls the callback with the correct parameters", () =>
    {
        const spy = jasmine.createSpy();
        spy.and.returnValue(null);
        mapArrayMap(values, spy);
        expect(spy.calls.count()).toBe(3);
        expect(spy.calls.argsFor(0)).toEqual([1, "a"]);
        expect(spy.calls.argsFor(1)).toEqual([2, "b"]);
        expect(spy.calls.argsFor(2)).toEqual([3, "c"]);
    });

    it("| returns the mapped values", () =>
    {
        const result: (1 | 2 | 3)[] = mapArrayMap(values, (value) => value);
        expect(result).toEqual([1, 2, 3]);
    });
});