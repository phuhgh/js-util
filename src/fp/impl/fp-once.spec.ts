import { fpOnce } from "./fp-once.js";
import createSpy = jasmine.createSpy;
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> fpOnce", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| calls the function once with the expected arguments", () =>
    {
        const spy = createSpy<(a: number, b: number, c: number) => number>();
        const oncedSpy = fpOnce(spy);

        oncedSpy(1, 2, 3);
        // @ts-expect-error - should be a compile error, signature doesn't match
        oncedSpy(1, 2, 3, 4);

        expect(spy).toHaveBeenCalledOnceWith(1, 2, 3);
    });

    it("| returns the callback's original return each time", () =>
    {
        let ret = 0;
        const oncedSpy = fpOnce(() => ++ret);

        expect(oncedSpy()).toBe(1);
        expect(oncedSpy()).toBe(1);
    });
});