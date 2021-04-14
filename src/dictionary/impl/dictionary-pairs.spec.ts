/* tslint:disable:newline-per-chained-call */
import { dictionaryPairs } from "./dictionary-pairs";

describe("=> dictionaryPairs", () =>
{
    const values = { a: 1, b: 2, c: 3 };

    it("| returns an array of key value pairs", () =>
    {
        expect(dictionaryPairs(values)).toEqual([["a", 1], ["b", 2], ["c", 3]]);
    });
});