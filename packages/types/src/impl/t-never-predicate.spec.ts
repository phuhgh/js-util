import { TNeverPredicate } from "./t-never-predicate";

describe("=> TNeverPredicate compile checks", () =>
{
    it("| compiles", () =>
    {
        // and if it compiles it runs ^^
        const foo: TNeverPredicate<never, true, "foo"> = true;
        // @ts-expect-error - not allowed
        const foo2: TNeverPredicate<never, true, "foo"> = "foo";

        const moo: TNeverPredicate<1, true, "foo"> = "foo";
        // @ts-expect-error - not allowed
        const moo2: TNeverPredicate<1, true, "foo"> = true;

        expect([foo, foo2, moo, moo2]).toBeDefined();
    });
});