import { CircularBuffer } from "./circular-buffer";
import { resetDebugState } from "@rc-js-util/test";

describe("=> CircularBuffer", () =>
{
    /**
     * i -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8
     * v  3   0   1   2   3  0  1  2  3  0  1  2  3  0
     */
    const buffer = CircularBuffer.createOne([0, 1, 2, 3]);

    beforeEach(() => resetDebugState());

    describe("=> inside input range", () =>
    {
        test("| returns the expected values", () =>
        {
            expect(buffer.getValue(0)).toBe(0);
            expect(buffer.getValue(3)).toBe(3);
        });
    });

    describe("=> going forward past end", () =>
    {
        test("| returns the expected values", () =>
        {
            expect(buffer.getValue(4)).toBe(0);
            expect(buffer.getValue(7)).toBe(3);
            expect(buffer.getValue(8)).toBe(0);
        });
    });

    describe("=> going backward past start", () =>
    {
        test("| returns the expected values", () =>
        {
            expect(buffer.getValue(-1)).toBe(3);
            expect(buffer.getValue(-4)).toBe(0);
            expect(buffer.getValue(-5)).toBe(3);
        });
    });
});