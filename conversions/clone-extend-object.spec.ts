import { cloneExtendObject } from "./clone-extend-object";

describe("=> cloneExtendObject", () =>
{
    it("| returns a new object, overwriting with the extension where common", () =>
    {
        const obj = { foo: true };
        const ext = { foo: false, moo: false };
        const result = cloneExtendObject(obj, ext);

        const expectation = {
            foo: false,
            moo: false,
        };

        expect(result).toEqual(expectation);
        // input should not be modified
        expect(obj).toEqual({ foo: true });
        expect(ext).toEqual({ foo: false, moo: false });
    });
});