import { debugDescribe, itShouldNotRunDebugWhenDebugIsFalse } from "../../test-utils";
import { dictionaryExtend } from "./dictionary-extend";

debugDescribe("=> dictionaryExtend", () =>
{
    itShouldNotRunDebugWhenDebugIsFalse(() =>
    {
        dictionaryExtend({}, {});
    });

    it("| errors if object is array", () =>
    {
        expect(() => dictionaryExtend([], {})).toThrow();
    });

    it("| errors if extension is array", () =>
    {
        expect(() => dictionaryExtend({}, [])).toThrow();
    });

    it("| extends the object, overwriting with the extension where common", () =>
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