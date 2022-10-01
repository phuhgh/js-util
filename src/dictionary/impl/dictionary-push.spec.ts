import { dictionaryPush } from "./dictionary-push.js";
import { IDictionary } from "../../typescript/i-dictionary.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> dictionaryPush", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values: IDictionary<number[]> = { a: [1] };

    it("| pushes to existing properties", () =>
    {
        dictionaryPush(values, "a", 2);
        expect(values.a).toEqual([1, 2]);
    });

    it("| creates new array where no property", () =>
    {
        dictionaryPush(values, "b", 1);
        expect(values.b).toEqual([1]);
    });
});