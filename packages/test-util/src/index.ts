import { _Debug } from "@rc-js-util/debug";
import { setDefaultUnitTestFlags } from "@rc-js-util/debug"

/**
 * @public
 * Asserts for colors given an array of pixels in the format of RGBA.
 */
export class ExpectColor
{
    public static reddish(color: Uint8Array, errorMessage: string): void
    {
        if (color.length % 4 !== 0)
        {
            return fail("unexpected length");
        }

        for (let i = 0, iEnd = color.length; i < iEnd; i += 4)
        {
            expectValueToBeNearTo(color[i], 255, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 1], 0, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 2], 0, 50, errorMessage + ` (index ${i})`);
            expect(color[i + 3]).toBe(255);
        }
    }

    public static greenish(color: Uint8Array, errorMessage: string): void
    {
        if (color.length % 4 !== 0)
        {
            return fail("unexpected length");
        }

        for (let i = 0, iEnd = color.length; i < iEnd; i += 4)
        {
            expectValueToBeNearTo(color[i], 0, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 1], 255, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 2], 0, 50, errorMessage + ` (index ${i})`);
            expect(color[i + 3]).toBe(255);
        }
    }

    public static blueish(color: Uint8Array, errorMessage: string): void
    {
        if (color.length % 4 !== 0)
        {
            return fail("unexpected length");
        }

        for (let i = 0, iEnd = color.length; i < iEnd; i += 4)
        {
            expectValueToBeNearTo(color[i], 0, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 1], 0, 50, errorMessage + ` (index ${i})`);
            expectValueToBeNearTo(color[i + 2], 255, 50, errorMessage + ` (index ${i})`);
            expect(color[i + 3]).toBe(255);
        }
    }

    public static red(color: Uint8Array): void
    {
        if (color.length % 4 !== 0)
        {
            return fail("unexpected length");
        }

        for (let i = 0, iEnd = color.length; i < iEnd; i += 4)
        {
            expect(color.slice(i, i + 4)).toEqual(new Uint8Array([255, 0, 0, 255]));
        }
    }

    public static transparentBlack(color: Uint8Array): void
    {
        if (color.length % 4 !== 0)
        {
            return fail("unexpected length");
        }

        for (let i = 0, iEnd = color.length; i < iEnd; i += 4)
        {
            expect(color.slice(i, i + 4)).toEqual(new Uint8Array([0, 0, 0, 0]));
        }
    }
}

export function itShouldCallAssert
(
    times: number,
    runTest: () => void,
)
    : void
{
    test("| has the correct number of assert calls", () =>
    {
        const debugMode = _Debug.getFlag("DEBUG_MODE");
        _Debug.setFlag("DEBUG_MODE", true);
        jest.spyOn(_Debug, "assert");
        runTest();
        expect(_Debug.assert).toHaveBeenCalledTimes(times);
        _Debug.setFlag("DEBUG_MODE", debugMode);
    });
}

export function itShouldNotRunDebugWhenDebugIsFalse
(
    runTest: () => void,
)
    : void
{
    test("doesn't run asserts when DEBUG_MODE is false", () =>
    {
        const debugMode = _Debug.getFlag("DEBUG_MODE");
        _Debug.setFlag("DEBUG_MODE", false);
        jest.spyOn(_Debug, "runBlock");
        jest.spyOn(_Debug, "assert");
        runTest();
        expect(_Debug.runBlock).not.toHaveBeenCalled();
        expect(_Debug.assert).not.toHaveBeenCalled();
        _Debug.setFlag("DEBUG_MODE", debugMode);
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
    if (value > expectation + variance || value < expectation - variance)
    {
        fail(message ?? `${value} is not within ${variance} of ${expectation}`);
    }
}

export function resetDebugState()
{
    DEBUG_MODE && setDefaultUnitTestFlags();
    RcJsUtilDebug.uniquePointers.clear();
}

export function applyLabel(label: string, callback: () => void): void
{
    _Debug.label = label;
    callback();
    _Debug.label = undefined;
}