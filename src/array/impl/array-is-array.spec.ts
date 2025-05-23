import { arrayIsArray } from "./array-is-array.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayIsArray", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const normalArray = [1] as const;
    const typedArray = new Float32Array(0);
    const arrayLike = { 0: 1, length: 1 };

    it("| returns true if normal Array", () =>
    {
        expect(arrayIsArray(normalArray)).toBe(true);
    });

    it("| returns true if typed array", () =>
    {
        expect(arrayIsArray(typedArray)).toBe(true);
    });

    it("| returns false if not typed array or regular Array", () =>
    {
        expect(arrayIsArray(arrayLike)).toBe(false);
    });
});