import { fpOnce } from "./fp-once";
import createSpy = jasmine.createSpy;
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> fpOnce", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
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