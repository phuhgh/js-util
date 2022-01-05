import { dictionaryForEach } from "./dictionary-foreach";
import { resetDebugState } from "@rc-js-util/test";

describe("=> dictionaryForEach", () =>
{
    const values = { a: 1, b: 2, c: 3 };

    beforeEach(() => resetDebugState());

    test("| calls the callback with the correct parameters", () =>
    {
        const spy = jest.fn();
        spy.mockReturnValue(null);
        dictionaryForEach(values, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).nthCalledWith(1, 1, "a", values);
        expect(spy).nthCalledWith(2, 2, "b", values);
        expect(spy).nthCalledWith(3, 3, "c", values);
    });
});