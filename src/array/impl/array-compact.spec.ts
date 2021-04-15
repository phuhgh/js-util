/* tslint:disable:newline-per-chained-call */
import { arrayCompact } from "./array-compact";

describe("=> arrayCompact", () =>
{
    const values = ["a", "b", null, undefined] as const;

    it("| returns an array minus null and undefined", () =>
    {
        const result: ("a" | "b")[] = arrayCompact(values);
        expect(result).toEqual(["a", "b"]);
    });
});