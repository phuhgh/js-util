import { mapFirstKey } from "./map-first-key";
import { resetDebugState } from "@rc-js-util/test";

describe("=> mapFirstKey", () =>
{
    beforeEach(() => resetDebugState());

    test("| returns the first key where available", () =>
    {
        const values = new Map([["a", 1], ["b", 2], ["c", 3]] as const);
        const result: "a" | "b" | "c" | undefined = mapFirstKey(values);
        expect(result).toEqual("a");
    });

    test("| returns undefined if empty", () =>
    {
        const values = new Map();
        const result = mapFirstKey(values);
        expect(result).toEqual(undefined);
    });
});