import { _Production } from "./_production";
import { resetDebugState } from "@rc-js-util/test";

describe("=> _Production.error", () =>
{
    beforeEach(() => resetDebugState());

    test("| throws an error with the expected message", () =>
    {
        expect(() =>
        {
            throw _Production.createError("test message");
        }).toThrowError("test message");
    });
});