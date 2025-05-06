import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { dictionaryCollect } from "./dictionary-collect.js";

describe("=> dictionaryCollect", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values = { "a": 1, "b": { potato: true }, "c": "yes" } as const;

    it("| calls the callback with the correct parameters", () =>
    {
        const spy = jasmine.createSpy();
        const m = new Map();
        dictionaryCollect(values, m, spy);
        expect(spy.calls.count()).toBe(3);
        expect(spy.calls.argsFor(0)).toEqual([m, values.a, "a", 0]);
        expect(spy.calls.argsFor(1)).toEqual([m, values.b, "b", 1]);
        expect(spy.calls.argsFor(2)).toEqual([m, values.c, "c", 2]);
    });

    it("| returns the collect value", () =>
    {
        const m = new Map();
        expect(dictionaryCollect(values, m, (value) => value)).toEqual(m);
    });
});