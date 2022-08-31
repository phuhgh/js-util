import { arrayReplaceOne } from "./array-replace-one";
import { setDefaultUnitTestFlags } from "../../test-utils";

describe("=> arrayReplaceOne", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    const a = ["a", "b", "b", "c"];

    it("| replaces a single match from the first argument", () =>
    {
        expect(arrayReplaceOne(a, "b", "e")).toBeTrue();
        expect(a).toEqual(["a", "e", "b", "c"]);
    });
});