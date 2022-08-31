import { dictionaryPairs } from "./dictionary-pairs";
import { setDefaultUnitTestFlags } from "../../test-utils";

describe("=> dictionaryPairs", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    const values = { a: 1, b: 2, c: 3 };

    it("| returns an array of key value pairs", () =>
    {
        expect(dictionaryPairs(values)).toEqual([["a", 1], ["b", 2], ["c", 3]]);
    });
});