import { arrayMin } from "./array-min";

describe("=> arrayMin", () =>
{
    it("| returns the min", () =>
    {
        expect(arrayMin(new Float32Array([-1, 0, 1]))).toBe(-1);
    });
});