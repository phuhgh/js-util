import type { TMaybeObject } from "./t-maybe-object.js";

interface ITest
{
    a: number;
    b: number;
}

describe("=> TMaybeObject", () =>
{
    it("| produces the expected compiler errors", () =>
    {
        const empty: TMaybeObject<ITest> = {};
        empty;

        const filled: TMaybeObject<ITest> = { a: 1, b: 2 };
        filled;


        // @ts-expect-error - we should get all the object or none of it
        const partial: TMaybeObject<ITest> = { a: 1 };
        partial;

        // @ts-expect-error - all property types must match
        const mismatch: TMaybeObject<ITest> = { a: "", b: 1 };
        mismatch;
    });
});