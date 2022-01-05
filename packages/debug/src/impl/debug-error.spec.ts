import { _Debug } from "./_debug";

describe("=> _Debug.error", () =>
{
    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
    });

    describe("=> compilation checks", () =>
    {
        test("| has the right ergonomics", () =>
        {
            DEBUG_MODE && _Debug.assert(Math.random() > -1, "this is always true");
        });
    });

    test("| throws an error with the expected message", () =>
    {
        expect(() => _Debug.error("test message")).toThrowError("test message");
    });
});