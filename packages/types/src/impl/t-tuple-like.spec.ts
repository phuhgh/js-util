// noinspection JSUnusedAssignment

import { TTupleLike } from "./t-tuple-like";

describe("=> TTupleLike", () =>
{
    describe("=> with length specified", () =>
    {
        test("| it requires arrays of the correct length", () =>
        {
            // @ts-expect-error incorrect length
            let t: TTupleLike<number, number, 2> = [];
            t = [1, 2] as const;
            t[0] = 1;
        });
    });

    describe("=> with index number type", () =>
    {
        test("| it allows number index", () =>
        {
            const t: TTupleLike<number, number, number> = [];
            t[0] = 1;
            // eslint-disable-next-line @typescript-eslint/no-inferrable-types
            const index: number = 1;
            t[index] = 2;
        });
    });

    describe("=> with union index type", () =>
    {
        test("| it doesn't allow number index", () =>
        {
            const t: TTupleLike<0 | 1 | 2 | 3, number, number> = [0, 0, 0, 0];
            t[1] = 1;
            // eslint-disable-next-line @typescript-eslint/no-inferrable-types
            const index: number = 1;
            // @ts-expect-error index with number not allowed
            t[index] = 2;
        });
    });
});