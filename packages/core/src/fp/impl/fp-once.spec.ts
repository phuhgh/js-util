import { fpOnce } from "./fp-once";
import { resetDebugState } from "@rc-js-util/test";

describe("=> fpOnce", () =>
{
    beforeEach(() => resetDebugState());

    test("| calls the function once with the expected arguments", () =>
    {
        const spy = jest.fn() as jest.Mock<number, [a: number, b: number, c: number]>;
        const oncedSpy = fpOnce(spy);

        oncedSpy(1, 2, 3);
        // @ts-expect-error - should be a compile error, signature doesn't match
        oncedSpy(1, 2, 3, 4);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(1, 2, 3);
    });

    test("| returns the callback's original return each time", () =>
    {
        let ret = 0;
        const oncedSpy = fpOnce(() => ++ret);

        expect(oncedSpy()).toBe(1);
        expect(oncedSpy()).toBe(1);
    });
});