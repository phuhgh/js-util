import { arrayCopyInto } from "./array-copy-into.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> arrayCopyInto", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| writes the values of the first argument into the second", () =>
    {
        const a = ["d", "e"];
        const b = ["a", "b", "c"];
        arrayCopyInto(a, b);

        expect(a).toEqual(["d", "e"]);
        expect(b).toEqual(["d", "e"]);
    });

    describe("=> where bounds are provided", () =>
    {
        it("| writes only those elements inside of the bounds", () =>
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