import { arrayInsertAtIndex } from "./array-insert-at-index.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> arrayInsertAtIndex", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| returns the expected index", () =>
    {
        const a = [1, 2, 3];
        arrayInsertAtIndex(a, 5, 1);
        expect(a).toEqual([1, 5, 2, 3]);
    });
});