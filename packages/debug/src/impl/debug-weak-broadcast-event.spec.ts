import { _Debug } from "./_debug";
import { DebugWeakBroadcastEvent } from "./debug-weak-broadcast-event";

describe("=> DebugWeakBroadcastEvent", () =>
{
    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
    });

    it("| does not return listeners that are missing the method", () =>
    {
        const emitter = new DebugWeakBroadcastEvent("m");
        emitter.addListener({});
        expect(emitter.getTargets().length).toBe(0);
    });
});