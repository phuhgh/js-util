import { arrayCompact } from "./array-compact";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

describe("=> arrayCompact", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    const values = ["a", "b", null, undefined] as const;

    it("| returns an array minus null and undefined", () =>
    {
        const result: ("a" | "b")[] = arrayCompact(values);
        expect(result).toEqual(["a", "b"]);
    });
});