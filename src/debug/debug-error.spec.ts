import { _Debug } from "./_debug";
import { debugDescribe } from "../test-utils";

debugDescribe("=> _Debug.error", () =>
{
    describe("=> compilation checks", () =>
    {
        it("| has the right ergonomics", () =>
        {
            DEBUG_MODE && _Debug.assert(Math.random() > -1, "this is always true");
        });
    });

    it("| throws an error with the expected message", () =>
    {
        expect(() => _Debug.error("test message")).toThrowError("test message");
    });
});