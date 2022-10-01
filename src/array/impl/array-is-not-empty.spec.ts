import { arrayIsNotEmpty } from "./array-is-not-empty.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayIsNotEmpty", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    describe("=> compile checks", () =>
    {
        it("| narrows the type where true", () =>
        {
            const a: Float32Array | null | undefined = new Float32Array(1);

            if (arrayIsNotEmpty(a))
            {
                isFloat32Array(a);
            }
        });
    });

    it("| returns false if null or undefined", () =>
    {
        expect(arrayIsNotEmpty(new Float32Array(1))).toBeTrue();
    });

    it("| returns false if empty", () =>
    {
        expect(arrayIsNotEmpty(new Float32Array(0))).toBeFalse();
    });

    function isFloat32Array(_a: Float32Array)
    {
        // for compiler check
    }
});
