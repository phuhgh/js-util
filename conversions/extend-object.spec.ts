import { itShouldNotRunDebugWhenDebugIsFalse } from "../test-utils";
import { extendObject } from "./extend-object";

describe("=> extendObject", () =>
{
    itShouldNotRunDebugWhenDebugIsFalse(() =>
    {
        extendObject({}, {});
    });

    it("| errors if object is array", () =>
    {
        expect(() => extendObject([], {})).toThrow();
    });

    it("| errors if extension is array", () =>
    {
        expect(() => extendObject({}, [])).toThrow();
    });

    it("| extends the object, overwriting with the extension where common", () =>
    {
        const obj = { foo: true };
        const ext = { foo: false, moo: false };
        extendObject(obj, ext);

        const expectation = {
            foo: false,
            moo: false,
        };

        expect(obj).toEqual(expectation);
    });
});