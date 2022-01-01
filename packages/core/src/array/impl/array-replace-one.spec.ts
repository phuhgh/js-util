import { arrayReplaceOne } from "./array-replace-one";
import { resetDebugState } from "@rc-js-util/test";

describe("=> arrayReplaceOne", () =>
{
    const a = ["a", "b", "b", "c"];

    beforeEach(() => resetDebugState());

    it("| replaces a single match from the first argument", () =>
    {
        expect(arrayReplaceOne(a, "b", "e")).toBeTrue();
        expect(a).toEqual(["a", "e", "b", "c"]);
    });
});