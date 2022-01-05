import { arrayIsNotEmpty } from "./array-is-not-empty";

describe("=> arrayIsNotEmpty", () =>
{
    describe("=> compile checks", () =>
    {
        test("| narrows the type where true", () =>
        {
            const a: Float32Array | null | undefined = new Float32Array(1);

            if (arrayIsNotEmpty(a))
            {
                isFloat32Array(a);
            }
        });
    });

    test("| returns false if null or undefined", () =>
    {
        expect(arrayIsNotEmpty(new Float32Array(1))).toBe(true);
    });

    test("| returns false if empty", () =>
    {
        expect(arrayIsNotEmpty(new Float32Array(0))).toBe(false);
    });

    function isFloat32Array(_a: Float32Array)
    {
        // for compiler check
    }
});
