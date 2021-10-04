// noinspection DuplicatedCode

import { _Debug, RcJsUtilDebugImpl } from "rc-js-util";
import { setDefaultUnitTestFlags } from "rc-js-util/bin/src/debug/impl/set-default-unit-test-flags";

export class ExpectColor
{
    public static reddish(color: Uint8Array, errorMessage: string): void
    {
        expect(color.length % 4)
            .withContext("unexpected length")
            .toBe(0);

        for (let i = 0, iEnd = color.length; i < iEnd; i += 4)
        {
            expectValueToBeNearTo(color[i], 255, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 1], 0, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 2], 0, 50, errorMessage + ` (index ${i})`);
            expect(color[i + 3])
                .withContext(errorMessage + ` (index ${i})`)
                .toBe(255);
        }
    }

    public static greenish(color: Uint8Array, errorMessage: string): void
    {
        expect(color.length % 4)
            .withContext("unexpected length")
            .toBe(0);

        for (let i = 0, iEnd = color.length; i < iEnd; i += 4)
        {
            expectValueToBeNearTo(color[i], 0, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 1], 255, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 2], 0, 50, errorMessage + ` (index ${i})`);
            expect(color[i + 3])
                .withContext(errorMessage + ` (index ${i})`)
                .toBe(255);
        }
    }

    public static blueish(color: Uint8Array, errorMessage: string): void
    {
        expect(color.length % 4)
            .withContext("unexpected length")
            .toBe(0);

        for (let i = 0, iEnd = color.length; i < iEnd; i += 4)
        {
            expectValueToBeNearTo(color[i], 0, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 1], 0, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 2], 255, 50, errorMessage + ` (index ${i})`);
            expect(color[i + 3])
                .withContext(errorMessage + ` (index ${i})`)
                .toBe(255);
        }
    }

    public static red(color: Uint8Array, errorMessage: string): void
    {
        expect(color.length % 4)
            .withContext("unexpected length")
            .toBe(0);

        for (let i = 0, iEnd = color.length; i < iEnd; i += 4)
        {
            expect(color.slice(i, i + 4)).toEqual(new Uint8Array([255, 0, 0, 255]), errorMessage);
        }
    }

    public static transparentBlack(color: Uint8Array, errorMessage: string): void
    {
        expect(color.length % 4)
            .withContext("unexpected length")
            .toBe(0);

        for (let i = 0, iEnd = color.length; i < iEnd; i += 4)
        {
            expect(color.slice(i, i + 4)).toEqual(new Uint8Array([0, 0, 0, 0]), errorMessage);
        }
    }
}

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

export function expectValueToBeNearTo
(
    value: number,
    expectation: number,
    variance: number = 10E-7,
    message?: string,
)
    : void
{
    expect(value)
        .withContext(message ?? "")
        .toBeLessThan(expectation + variance);
    expect(value).toBeGreaterThan(expectation - variance);
}

export function debugDescribe(label: string, callback: () => void): void
{
    describe(label, () =>
    {
        beforeEach(() =>
        {
            setDefaultUnitTestFlags();
            RcJsUtilDebugImpl.uniquePointers.clear();
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
            setDefaultUnitTestFlags();
            RcJsUtilDebugImpl.uniquePointers.clear();
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