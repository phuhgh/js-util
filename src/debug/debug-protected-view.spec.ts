import { DebugProtectedView } from "./debug-protected-view";

describe("=> DebugProtectedView", () =>
{
    describe("unwrapProtectedView", () =>
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
});