import { dictionaryPairs } from "./dictionary-pairs";
import { debugDescribe } from "../../test-utils";

debugDescribe("=> dictionaryPairs", () =>
{
    const values = { a: 1, b: 2, c: 3 };

    it("| returns an array of key value pairs", () =>
    {
        expect(dictionaryPairs(values)).toEqual([["a", 1], ["b", 2], ["c", 3]]);
    });
});