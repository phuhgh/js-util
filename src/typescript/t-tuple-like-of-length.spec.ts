// noinspection JSUnusedAssignment,BadExpressionStatementJS

import { TTupleLikeOfLength } from "./t-tuple-like-of-length.js";

describe("=> TTupleLikeOfLength", () =>
{
    describe("=> with a length of lte 17", () =>
    {
        it("| creates a tuple of the expected length", () =>
        {
            // @ts-expect-error incorrect length
            let t: TTupleLikeOfLength<number, 4> = [0, 0, 0];
            t = [0, 0, 0, 0];
            t[0];
            t[1];
            t[2];
            t[3];
            // @ts-expect-error index out of bounds
            t[4];
            // @ts-expect-error index out of bounds
            t[-1];
            t[0] = 1;
            t[1] = 1;
            t[2] = 1;
            t[3] = 1;
            // @ts-expect-error index out of bounds
            t[4] = 1;
            // @ts-expect-error incorrect type
            t[3] = "hai";
        });
    });

    describe("=> with a length of gt 17", () =>
    {
        it("| it creates an array type", () =>
        {
            const a: number[] = new Array(1);
            const t: TTupleLikeOfLength<number, 18> = a;
            t[0];
            t[1];
            t[21];
            // eslint-disable-next-line @typescript-eslint/no-inferrable-types
            const index: number = 2;
            t[index];

            t[4] = 1;
            // @ts-expect-error incorrect type
            t[3] = "hai";
        });
    });

    describe("=> with a length of number", () =>
    {
        it("| creates an array type", () =>
        {
            const a: number[] = new Array(1);
            const t: TTupleLikeOfLength<number, number> = a;
            t[0];
            t[1];
            t[21];
            // eslint-disable-next-line @typescript-eslint/no-inferrable-types
            const index: number = 2;
            t[index];

            t[4] = 1;
            // @ts-expect-error incorrect type
            t[3] = "hai";
        });
    });

    describe("=> with a length of never", () =>
    {
        it("| creates an array type", () =>
        {
            const a: number[] = new Array(1);
            const t: TTupleLikeOfLength<number, never> = a;
            t[0];
            t[1];
            t[21];
            // eslint-disable-next-line @typescript-eslint/no-inferrable-types
            const index: number = 2;
            t[index];

            t[4] = 1;
            // @ts-expect-error incorrect type
            t[3] = "hai";
        });
    });
});