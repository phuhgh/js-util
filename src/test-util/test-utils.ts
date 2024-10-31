import { _Debug } from "../debug/_debug.js";
import { getEmscriptenTestModuleOptions } from "../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { getGlobal } from "../runtime/get-global.js";
import { _Production } from "../production/_production.js";
import { _Promise } from "../promise/_promise.js";
import { Mulberry32Generator } from "../number/random-numbers/mulberry-32-generator.js";

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

export function getTestModuleOptions(shared: boolean = true)
{
    let initialMemory = 128;
    if (Boolean(_BUILD.ASAN))
    {
        initialMemory = 4810;
    }
    return getEmscriptenTestModuleOptions({ initialMemoryPages: initialMemory, shared: shared });
}

export class TestGarbageCollector
{
    public static gc = getGlobal()["gc"] as (() => void) | undefined;
    public static isAvailable = TestGarbageCollector.gc != null;

    /**
     * Manual gc calls in chrome seem to have timing dependent elements, this arrangement seems to reliably cause the
     * objects under test to get gc'd.
     */
    static async testFriendlyGc(): Promise<number>
    {
        if (TestGarbageCollector.gc == null)
        {
            throw _Production.createError("Check if gc is available first using `TestGarbageCollector.gcAvailable`.");
        }
        const r = createLotsOfGarbage().sum();
        TestGarbageCollector.gc();

        await _Promise.delay(4);

        return r;
    }
}


// try to create garbage in a way which the optimizing compiler doesn't just optimize out
function createLotsOfGarbage(): SillyClass
{
    const rgen = new Mulberry32Generator(2027);
    let current: SillyClass | null = null;

    for (let i = 0; i < 5000 + Math.floor(rgen.getNext() * 5000); i++)
    {
        current = new SillyClass(rgen.getNext(), current);
    }

    return current!;
}

class SillyClass
{
    public constructor(
        private value: number,
        private next: SillyClass | null,
    )
    {
    }

    public sum(): number
    {
        const next = this.next ? this.next.sum() : 0;
        return this.value + next;
    }
}
