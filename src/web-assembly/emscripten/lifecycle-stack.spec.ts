import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { LifecycleStack } from "./lifecycle-stack.js";
import { Test_resetLifeCycle } from "../../test-util/test_reset-life-cycle.js";

// todo jack: probably want a few more cases here now
describe("=> LifecycleStack", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
        Test_resetLifeCycle();
    });

    it("| returns consistently from push and pop", () =>
    {
        const stack = new LifecycleStack();

        const first = stack.push();
        const second = stack.push();

        expect(second).not.toBe(first);
        expect(stack.pop()).toBe(second);
        expect(stack.pop()).toBe(first);
        expect(() => stack.pop()).toThrow();
    });
});