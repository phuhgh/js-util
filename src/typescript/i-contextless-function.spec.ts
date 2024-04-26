import { IContextlessFn } from "./i-contextless-function.js";

describe("=> IContextlessFn compile checks", () =>
{
    function takesContextless(_fn: IContextlessFn<[], void>)
    {
        // no action required
    }

    it("| disallows use of this with functions", () =>
    {
        // noinspection JSPotentiallyInvalidUsageOfClassThis
        class Test
        {
            public fun()
            {
                takesContextless(function ()
                {
                    // @ts-expect-error - this should not compile
                    return ++this.foo;
                });

                return this.foo;
            }

            private foo = 1;
        }

        return new Test();
    });

    it("| does not affect lambdas", () =>
    {
        class Test
        {
            public fun()
            {
                takesContextless(() =>
                {
                    return ++this.foo;
                });
            }

            private foo = 1;
        }

        return new Test();
    });
});