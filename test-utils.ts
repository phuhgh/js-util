import { Debug } from "./debug/debug";

export function itShouldCallAssert(times: number, runTest: () => void): void
{
    it("| has the correct number of assert calls", () =>
    {
        spyOn(Debug, "assert");
        runTest();
        expect(Debug.assert).toHaveBeenCalledTimes(6);
    });
}

export function itShouldNotRunDebugWhenDebugIsFalse(runTest: () => void): void
{
    it("doesn't run asserts when DEBUG_MODE is false", () =>
    {
        (DEBUG_MODE as boolean) = false;
        spyOn(Debug, "runBlock");
        spyOn(Debug, "assert");
        runTest();
        expect(Debug.runBlock).not.toHaveBeenCalled();
        expect(Debug.assert).not.toHaveBeenCalled();
    });
}
