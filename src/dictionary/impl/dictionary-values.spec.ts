import { IDictionary } from "../../typescript/i-dictionary.js";
import { dictionaryValues } from "./dictionary-values.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> dictionaryValues", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values: IDictionary<number> = { a: 1, b: 2 };

    it("| returns dictionary values", () =>
    {
        expect(dictionaryValues(values)).toEqual([1, 2]);
    });
});