import { ReferenceCounterStore } from "./reference-counter-store";

describe("=> ReferenceCountedStore", () =>
{
    test("| calls the callback when the reference count hits 0", () =>
    {
        const spy = jest.fn();
        const refCount = new ReferenceCounterStore(spy);
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

    test("| doesn't call the callback if there was no value", () =>
    {
        const spy = jest.fn();
        const refCount = new ReferenceCounterStore(spy);
        const o = {};
        refCount.remove(o);
        expect(spy).not.toBeCalled();
    });

    test("| returns the expected ref counts", () =>
    {
        const refCount = new ReferenceCounterStore();

        expect(refCount.remove({})).toBe(0);
        const o = {};
        expect(refCount.add(o)).toBe(1);
        expect(refCount.add(o)).toBe(2);
        expect(refCount.remove(o)).toBe(1);
        expect(refCount.remove(o)).toBe(0);
    });
});