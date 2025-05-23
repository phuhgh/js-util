import { ReferenceCounter } from "./reference-counter.js";
import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";
import createSpy = jasmine.createSpy;

describe("=> ReferenceCountedStore", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| calls the callback when the reference count hits 0", () =>
    {
        const spy = createSpy();
        const refCount = new ReferenceCounter(spy);
        const o = {};
        refCount.add(o);
        refCount.add(o);
        refCount.remove(o);
        expect(spy).not.toHaveBeenCalled();
        refCount.remove(o);
        expect(spy).toHaveBeenCalledWith(o);
        refCount.remove(o);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it("| doesn't call the callback if there was no value", () =>
    {
        const spy = createSpy();
        const refCount = new ReferenceCounter(spy);
        const o = {};
        refCount.remove(o);
        expect(spy).not.toHaveBeenCalled();
    });

    it("| returns the expected ref counts", () =>
    {
        const refCount = new ReferenceCounter();

        expect(refCount.remove({})).toBe(0);
        const o = {};
        expect(refCount.add(o)).toBe(1);
        expect(refCount.add(o)).toBe(2);
        expect(refCount.remove(o)).toBe(1);
        expect(refCount.remove(o)).toBe(0);
    });
});