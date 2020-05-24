import { _Debug } from "./debug/_debug";

/* tslint:disable:newline-per-chained-call */

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
    it("doesn't run asserts when DEBUG_MODE is false", () =>
    {
        _Debug.unsetFlag("DEBUG_MODE");
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT");
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