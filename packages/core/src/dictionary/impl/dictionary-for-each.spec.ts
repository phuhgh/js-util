import { dictionaryForEach } from "./dictionary-foreach";
import { debugDescribe } from "../../test-utils";

debugDescribe("=> dictionaryForEach", () =>
{
    const values = { a: 1, b: 2, c: 3 };

    it("| calls the callback with the correct parameters", () =>
    {
        const spy = jasmine.createSpy();
        spy.and.returnValue(null);
        dictionaryForEach(values, spy);
        expect(spy.calls.count()).toBe(3);
        expect(spy.calls.argsFor(0)).toEqual([1, "a", values]);
        expect(spy.calls.argsFor(1)).toEqual([2, "b", values]);
        expect(spy.calls.argsFor(2)).toEqual([3, "c", values]);
    });
});