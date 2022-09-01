import { _Debug } from "./_debug.js";

describe("=> _Debug.error", () =>
{
    describe("=> compilation checks", () =>
    {
        it("| has the right ergonomics", () =>
        {
            _BUILD.DEBUG && _Debug.assert(Math.random() > -1, "this is always true");
        });
    });

    it("| throws an error with the expected message", () =>
    {
        expect(() => _Debug.error("test message")).toThrowError("test message");
    });
});