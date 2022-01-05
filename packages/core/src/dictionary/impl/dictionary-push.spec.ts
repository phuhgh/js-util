import { dictionaryPush } from "./dictionary-push";
import { IDictionary } from "@rc-js-util/types";
import { resetDebugState } from "@rc-js-util/test";

describe("=> dictionaryPush", () =>
{
    const values: IDictionary<number[]> = { a: [1] };

    beforeEach(() => resetDebugState());

    test("| pushes to existing properties", () =>
    {
        dictionaryPush(values, "a", 2);
        expect(values.a).toEqual([1, 2]);
    });

    test("| creates new array where no property", () =>
    {
        dictionaryPush(values, "b", 1);
        expect(values.b).toEqual([1]);
    });
});