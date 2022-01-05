import { arrayCopyInto } from "./array-copy-into";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayCopyInto", () =>
{
    beforeEach(() => resetDebugState());

    test("| writes the values of the first argument into the second", () =>
    {
        const a = ["d", "e"];
        const b = ["a", "b", "c"];
        arrayCopyInto(a, b);

        expect(a).toEqual(["d", "e"]);
        expect(b).toEqual(["d", "e"]);
    });

    describe("=> where bounds are provided", () =>
    {
        test("| writes only those elements inside of the bounds", () =>
        {
            const a = ["d", "e"];
            const b = ["a", "b", "c"];
            arrayCopyInto(a, b, 1, 1);
            expect(a).toEqual(["d", "e"]);
            expect(b).toEqual(["e"]);

            arrayCopyInto(a, b, 0, 1);
            expect(a).toEqual(["d", "e"]);
            expect(b).toEqual(["d"]);
        });
    });
});