import { IDictionary } from "../../typescript/i-dictionary.js";
import { dictionaryValues } from "./dictionary-values.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

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