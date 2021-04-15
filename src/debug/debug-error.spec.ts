/* tslint:disable:newline-per-chained-call */

import { _Debug } from "./_debug";

describe("=> _Debug.error", () =>
{
    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
    });

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