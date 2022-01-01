import { DebugProtectedView } from "./debug-protected-view";

describe("=> DebugProtectedView", () =>
{
    describe("unwrapProtectedView", () =>
    {
        describe("=> when valid", () =>
        {
            it("| returns the original object", () =>
            {
                const protectedView = new DebugProtectedView([], "");
                const thingToBeProtected = { foo: true };
                const protectedThing = protectedView.createProtectedView(thingToBeProtected);
                expect(protectedThing).not.toBe(thingToBeProtected);
                expect(DebugProtectedView.unwrapProtectedView(protectedThing)).toBe(thingToBeProtected);
            });
        });

        describe("=> when the view has been invalidated", () =>
        {
            it("| it errors", () =>
            {
                const protectedView = new DebugProtectedView([], "meep meep");
                const thingToBeProtected = { foo: true };
                const protectedThing = protectedView.createProtectedView(thingToBeProtected);
                protectedView.invalidate();
                expect(() => DebugProtectedView.unwrapProtectedView(protectedThing)).toThrowError("ProtectedView view invalidated - meep meep");
            });
        });

        describe("=> when given not a proxy", () =>
        {
            it("| it returns the thing", () =>
            {
                const thing = { foo: true };
                expect(DebugProtectedView.unwrapProtectedView(thing)).toBe(thing);
            });
        });
    });
});