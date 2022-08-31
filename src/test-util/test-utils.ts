import { _Debug } from "../debug/_debug";

export function itShouldCallAssert(times: number, runTest: () => void): void
{
    it("| has the correct number of assert calls", () =>
    {
        spyOn(_Debug, "assert");
        runTest();
        expect(_Debug.assert).toHaveBeenCalledTimes(times);
    });
}

export function itShouldNotRunDebugWhenDebugIsFalse(runTest: () => void): void
{
    it("doesn't run asserts when _BUILD.DEBUG is false", () =>
    {
        _Debug.setFlag("DEBUG", false);
        _Debug.setFlag("DISABLE_BREAKPOINT", true);
        spyOn(_Debug, "runBlock");
        spyOn(_Debug, "assert");
        runTest();
        expect(_Debug.runBlock).not.toHaveBeenCalled();
        expect(_Debug.assert).not.toHaveBeenCalled();
    });
}


export function expectValueToBeNearTo(value: number, expectation: number, variance: number = 10E-7): void
{
    expect(value).toBeLessThan(expectation + variance);
    expect(value).toBeGreaterThan(expectation - variance);
}

