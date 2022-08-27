import { IDictionary } from "../../typescript/i-dictionary";
import { dictionaryValues } from "./dictionary-values";
import { setDefaultUnitTestFlags } from "../../test-utils";

describe("=> dictionaryValues", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    const values: IDictionary<number> = { a: 1, b: 2 };

    it("| returns dictionary values", () =>
    {
        expect(dictionaryValues(values)).toEqual([1, 2]);
    });
});