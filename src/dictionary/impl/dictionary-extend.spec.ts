import { itShouldNotRunDebugWhenDebugIsFalse } from "../../test-util/test-utils.js";
import { dictionaryExtend } from "./dictionary-extend.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> dictionaryExtend", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

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