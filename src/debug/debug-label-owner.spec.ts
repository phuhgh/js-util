import { _Debug } from "./_debug.js";
import { DebugLabelOwner } from "./debug-label-owner.js";

describe("=> DebugLabelOwner", () =>
{
    it("| sets and clears the label", () =>
    {
        (() =>
        {
            expect(_Debug.label).toBe(undefined);
            using _label = new DebugLabelOwner("test");
            expect(_Debug.label).toBe("test");
        })();

        expect(_Debug.label).toBe(undefined);
    });
});