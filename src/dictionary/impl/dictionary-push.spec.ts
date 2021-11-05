import { dictionaryPush } from "./dictionary-push";
import { IDictionary } from "../../typescript/i-dictionary";
import { debugDescribe } from "../../test-utils";

debugDescribe("=> dictionaryPush", () =>
{
    const values: IDictionary<number[]> = { a: [1] };

    it("| pushes to existing properties", () =>
    {
        dictionaryPush(values, "a", 2);
        expect(values.a).toEqual([1, 2]);
    });

    it("| creates new array where no property", () =>
    {
        dictionaryPush(values, "b", 1);
        expect(values.b).toEqual([1]);
    });
});