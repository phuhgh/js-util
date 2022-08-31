import { arrayCopyInto } from "./array-copy-into";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> arrayCopyInto", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
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