import { dictionaryPairs } from "./dictionary-pairs";
import { resetDebugState } from "@rc-js-util/test";

describe("=> dictionaryPairs", () =>
{
    const values = { a: 1, b: 2, c: 3 };

    beforeEach(() => resetDebugState());

    it("| returns an array of key value pairs", () =>
    {
        expect(dictionaryPairs(values)).toEqual([["a", 1], ["b", 2], ["c", 3]]);
    });
});