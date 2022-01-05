import { IDictionary } from "@rc-js-util/types";
import { dictionaryValues } from "./dictionary-values";
import { resetDebugState } from "@rc-js-util/test";

describe("=> dictionaryValues", () =>
{
    const values: IDictionary<number> = { a: 1, b: 2 };

    beforeEach(() => resetDebugState());

    test("| returns dictionary values", () =>
    {
        expect(dictionaryValues(values)).toEqual([1, 2]);
    });
});