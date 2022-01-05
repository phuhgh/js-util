import { arrayIsArray } from "./array-is-array";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayIsArray", () =>
{
    const normalArray = [1] as const;
    const typedArray = new Float32Array(0);
    const arrayLike = { 0: 1, length: 1 };

    beforeEach(() => resetDebugState());

    test("| returns true if normal Array", () =>
    {
        expect(arrayIsArray(normalArray)).toBe(true);
    });

    test("| returns true if typed array", () =>
    {
        expect(arrayIsArray(typedArray)).toBe(true);
    });

    test("| returns false if not typed array or regular Array", () =>
    {
        expect(arrayIsArray(arrayLike)).toBe(false);
    });
});