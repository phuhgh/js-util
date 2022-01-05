import { arrayReplaceOne } from "./array-replace-one";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayReplaceOne", () =>
{
    const a = ["a", "b", "b", "c"];

    beforeEach(() => resetDebugState());

    test("| replaces a single match from the first argument", () =>
    {
        expect(arrayReplaceOne(a, "b", "e")).toBe(true);
        expect(a).toEqual(["a", "e", "b", "c"]);
    });
});