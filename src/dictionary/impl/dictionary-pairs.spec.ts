import { dictionaryPairs } from "./dictionary-pairs.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> dictionaryPairs", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const values = { a: 1, b: 2, c: 3 };

    it("| returns an array of key value pairs", () =>
    {
        expect(dictionaryPairs(values)).toEqual([["a", 1], ["b", 2], ["c", 3]]);
    });
});