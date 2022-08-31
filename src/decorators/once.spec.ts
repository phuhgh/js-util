import { Once } from "./once";
import { setDefaultUnitTestFlags } from "../test-utils";

describe("=> once decorator", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    let argTestRan = false;

    class Test
    {
        public constructor
        (
            private v: number,
        )
        {
        }

        @Once
        public increment()
        {
            return ++this.v;
        }

        @Once
        public argumentTest(a: number, b: number)
        {
            expect(a).toBe(1);
            expect(b).toBe(2);
            argTestRan = true;
        }
    }

    const t1 = new Test(0);

    it("| runs the method only once", () =>
    {
        expect(t1.increment()).toBe(1);
        expect(t1.increment()).toBe(1);

        const t2 = new Test(10);

        expect(t2.increment()).toBe(11);
        expect(t2.increment()).toBe(11);
    });

    it("| proxies arguments", () =>
    {
        t1.argumentTest(1, 2);
        expect(argTestRan).toBeTrue();
    });
});