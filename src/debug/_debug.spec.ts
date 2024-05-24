import { _Debug } from "./_debug.js";

describe("=> _Debug", () =>
{
    describe("=> createLabelOwner", () =>
    {
        it("| sets and clears the label", () =>
        {
            (() =>
            {
                expect(_Debug.label).toBe(undefined);
                using _label = _Debug.createLabelOwner("test");
                expect(_Debug.label).toBe("test");
            })();

            expect(_Debug.label).toBe(undefined);
        });
    });
});