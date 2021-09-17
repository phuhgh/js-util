import { _Production } from "./_production";
import { debugDescribe } from "../test-utils";

debugDescribe("=> _Production.error", () =>
{
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