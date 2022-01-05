import { arrayCompact } from "./array-compact";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayCompact", () =>
{
    const values = ["a", "b", null, undefined] as const;

    beforeEach(() => resetDebugState());

    test("| returns an array minus null and undefined", () =>
    {
        const result: ("a" | "b")[] = arrayCompact(values);
        expect(result).toEqual(["a", "b"]);
    });
});