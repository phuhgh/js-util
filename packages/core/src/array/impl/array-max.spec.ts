import { arrayMax } from "./array-max";

describe("=> arrayMax", () =>
{
    test("| returns the max", () =>
    {
        expect(arrayMax(new Float32Array([-1, 0, 1]))).toBe(1);
    });
});