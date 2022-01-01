import { _Production } from "./_production";
import { resetDebugState } from "@rc-js-util/test";

describe("=> _Production.error", () =>
{
    beforeEach(() => resetDebugState());

    describe("=> compilation checks", () =>
    {
        it("| narrows types where used as a guard", () =>
        {
            let r = foo();

            if (typeof r === "string")
            {
                throw _Production.createError("test");
            }

            ++r;

            return r;
        });
    });

    it("| throws an error with the expected message", () =>
    {
        expect(() =>
        {
            throw _Production.createError("test message");
        }).toThrowError("test message");
    });
});

function foo(): string | number
{
    return 1;
}