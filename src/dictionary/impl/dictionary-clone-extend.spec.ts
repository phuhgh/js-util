import { dictionaryCloneExtend } from "./dictionary-clone-extend.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> dictionaryCloneExtend", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| returns a new object, overwriting with the extension where common", () =>
    {
        const obj = { foo: true };
        const ext = { foo: false, moo: false };
        const result = dictionaryCloneExtend(obj, ext);

        const expectation = {
            foo: false,
            moo: false,
        };

        expect(result).toEqual(expectation);
        // input should not be modified
        expect(obj).toEqual({ foo: true });
        expect(ext).toEqual({ foo: false, moo: false });
    });
});