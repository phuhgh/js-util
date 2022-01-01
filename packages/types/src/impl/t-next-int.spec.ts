// noinspection BadExpressionStatementJS

import { TNextInt } from "./t-next-int";

describe("=> TNextInt", () =>
{
    describe("=> lte 16", () =>
    {
        it("| gives the next int", () =>
        {
            // @ts-expect-error not next int
            let int: TNextInt<15> = 17;
            int = 16;
            int;
        });
    });

    describe("=> gte 17", () =>
    {
        it("| gives number", () =>
        {
            const int: TNextInt<17> = 1e6;
            int;
        });
    });
});