import { _Production } from "./_production.js";
import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";

describe("=> _Production.error", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

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