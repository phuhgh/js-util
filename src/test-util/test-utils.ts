import { _Debug } from "../debug/_debug.js";
import { getEmscriptenTestModuleOptions } from "../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { IDictionary } from "../typescript/i-dictionary.js";

/**
 * @internal
 */
export function itShouldCallAssert(times: number, runTest: () => void): void
{
    it("| has the correct number of assert calls", () =>
    {
        spyOn(_Debug, "assert");
        runTest();
        expect(_Debug.assert).toHaveBeenCalledTimes(times);
    });
}

/**
 * @internal
 */
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

/**
 * @internal
 */
export function expectValueToBeNearTo(value: number, expectation: number, variance: number = 10E-7): void
{
    expect(value).toBeLessThan(expectation + variance);
    expect(value).toBeGreaterThan(expectation - variance);
}


declare const process: { env: IDictionary<string>, argv: readonly string[] };

export function getTestModuleOptions()
{
    let mode = process.argv.find((v) => v.startsWith("JSU_BUILD_MODE="));

    if (mode != null)
    {
        mode = mode.split("=")[1];
    }
    let initialMemory = 128;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    switch (mode)
    {
        case "ASAN":
            initialMemory = 4810;
            break;
    }
    return getEmscriptenTestModuleOptions({ initialMemoryPages: initialMemory });
}