import { dictionaryExtend } from "./dictionary-extend";
import { itShouldNotRunDebugWhenDebugIsFalse, resetDebugState } from "@rc-js-util/test";

describe("=> dictionaryExtend", () =>
{
    beforeEach(() => resetDebugState());

    itShouldNotRunDebugWhenDebugIsFalse(() =>
    {
        dictionaryExtend({}, {});
    });

    test("| errors if object is array", () =>
    {
        expect(() => dictionaryExtend([], {})).toThrow();
    });

    test("| errors if extension is array", () =>
    {
        expect(() => dictionaryExtend({}, [])).toThrow();
    });

    test("| extends the object, overwriting with the extension where common", () =>
    {
        const obj = { foo: true };
        const ext = { foo: false, moo: false };
        dictionaryExtend(obj, ext);

        const expectation = {
            foo: false,
            moo: false,
        };

        expect(obj).toEqual(expectation);
    });
});