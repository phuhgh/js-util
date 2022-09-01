import { CircularBuffer } from "./circular-buffer.js";
import { setDefaultUnitTestFlags } from "../test-util/set-default-unit-test-flags.js";

describe("=> CircularBuffer", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    /**
     * i -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8
     * v  3   0   1   2   3  0  1  2  3  0  1  2  3  0
     */
    const buffer = CircularBuffer.createOne([0, 1, 2, 3]);

    describe("=> inside input range", () =>
    {
        it("| returns the expected values", () =>
        {
            expect(buffer.getValue(0)).toBe(0, "index 0");
            expect(buffer.getValue(3)).toBe(3, "index 3");
        });
    });

    describe("=> going forward past end", () =>
    {
        it("| returns the expected values", () =>
        {
            expect(buffer.getValue(4)).toBe(0, "index 4");
            expect(buffer.getValue(7)).toBe(3, "index 7");
            expect(buffer.getValue(8)).toBe(0, "index 8");
        });
    });

    describe("=> going backward past start", () =>
    {
        it("| returns the expected values", () =>
        {
            expect(buffer.getValue(-1)).toBe(3, "index -1");
            expect(buffer.getValue(-4)).toBe(0, "index -4");
            expect(buffer.getValue(-5)).toBe(3, "index -5");
        });
    });
});