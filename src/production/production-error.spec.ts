/* tslint:disable:newline-per-chained-call */
import { _Production } from "./_production";
import { _Debug } from "../debug/_debug";

describe("=> _Production.error", () =>
{
    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
    });

    describe("=> compilation checks", () =>
    {
        it("| narrows types where used as a guard", () =>
        {
            let r = foo();

            if (typeof r === "string")
            {
                _Production.error("test");
            }

            ++r;

            return r;
        });
    });

    it("| throws an error with the expected message", () =>
    {
        expect(() => _Production.error("test message")).toThrowError("test message");
    });
});

function foo(): string | number
{
    return 1;
}