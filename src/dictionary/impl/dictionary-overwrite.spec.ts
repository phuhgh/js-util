import { itShouldNotRunDebugWhenDebugIsFalse } from "../../test-util/test-utils.js";
import { dictionaryOverwrite } from "./dictionary-overwrite.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> dictionaryOverwrite", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    itShouldNotRunDebugWhenDebugIsFalse(() =>
    {
        dictionaryOverwrite({}, {});
    });

    it("| errors if object is array", () =>
    {
        expect(() => dictionaryOverwrite([], {})).toThrow();
    });

    it("| errors if extension is array", () =>
    {
        // @ts-expect-error - not permissible
        expect(() => dictionaryOverwrite({}, [])).toThrow();
    });

    it("| extends the object, overwriting with the extension where common", () =>
    {
        interface ITest
        {
            foo: boolean;
            moo: boolean;
        }

        const obj: ITest = { foo: true, moo: true };
        const ext = { foo: false, moo: false };
        dictionaryOverwrite(obj, ext);

        const expectation = {
            foo: false,
            moo: false,
        };

        expect(obj).toEqual(expectation);
    });
});