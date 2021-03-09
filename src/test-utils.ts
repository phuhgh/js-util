import { _Debug } from "./debug/_debug";
import { SetDefaultUnitTestFlags } from "./debug/impl/set-default-unit-test-flags";

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
        _Debug.setFlag("DEBUG_MODE", false);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
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

export function debugDescribe(label: string, callback: () => void): void
{
    describe(label, () =>
    {
        beforeEach(() =>
        {
            SetDefaultUnitTestFlags();
        });

        callback();
    });
}

export function fdebugDescribe(label: string, callback: () => void): void
{
    fdescribe(label, () =>
    {
        beforeEach(() =>
        {
            SetDefaultUnitTestFlags();
        });

        callback();
    });
}

export function debugIt(label: string, callback: () => void): void
{
    _Debug.label = label;
    it(label, callback);
    _Debug.label = undefined;
}

export function applyLabel(label: string, callback: () => void): void
{
    _Debug.label = label;
    callback();
    _Debug.label = undefined;
}