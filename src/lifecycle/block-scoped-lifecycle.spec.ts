import { lifecycleStack } from "../web-assembly/emscripten/lifecycle-stack.js";
import { IManagedResourceLinks } from "./managed-resource-links.js";
import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";
import { blockScope } from "./block-scoped-lifecycle.js";
import { SanitizedEmscriptenTestModule } from "../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { getTestModuleOptions } from "../test-util/test-utils.js";
import utilTestModule from "../external/util-test-module.mjs";
import type { IManagedResourceNode } from "./manged-resources.js";

describe("=> blockScope", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());

    beforeEach(async () =>
    {
        Test_setDefaultFlags();
        await testModule.initialize();
    });

    afterEach(() => testModule.endEmscriptenProgram());

    it("| handles nested calls", () =>
    {
        let outer!: IManagedResourceNode;

        blockScope(() =>
        {
            let inner!: IManagedResourceNode;
            outer = testModule.wrapper.lifecycleStrategy.createNode(null);
            expect(outer.getIsDestroyed()).toBe(false);

            blockScope(() =>
            {
                inner = testModule.wrapper.lifecycleStrategy.createNode(null);
                expect(inner.getIsDestroyed()).toBe(false);
            });

            expect(inner.getIsDestroyed()).toBe(true);
        });

        expect(outer.getIsDestroyed()).toBe(true);
    });

    it("| handles manual claim calls", () =>
    {
        let owner!: IManagedResourceNode;
        let child!: IManagedResourceNode;
        const thirdParty = testModule.wrapper.lifecycleStrategy.createNode(testModule.wrapper.rootNode);

        blockScope(() =>
        {
            [owner, child] = testFactory(thirdParty.getLinked());
            expect(owner.getIsDestroyed()).toBe(false);
            expect(child.getIsDestroyed()).toBe(false);
        });

        expect(owner.getIsDestroyed()).toBe(false);
        expect(child.getIsDestroyed()).toBe(false);

        testModule.wrapper.rootNode.getLinked().unlink(thirdParty);
        expect(owner.getIsDestroyed()).toBe(true);
        expect(child.getIsDestroyed()).toBe(true);
    });

    describe("=> error handling", () =>
    {
        afterEach(() => delete _BUILD.WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH);

        it("bubbles exceptions and pops the stack with WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH off", () =>
        {
            expect(() =>
            {
                blockScope(() =>
                {
                    expect(lifecycleStack.getSize()).toBe(1);
                    throw new Error();
                });
            }).toThrow();

            expect(lifecycleStack.getSize()).toBe(0);
        });

        it("bubbles exceptions without modifying the stack with WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH on", () =>
        {
            _BUILD.WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH = true;

            expect(() =>
            {
                blockScope(() =>
                {
                    expect(lifecycleStack.getSize()).toBe(1);
                    throw new Error();
                });
            }).toThrow();

            expect(lifecycleStack.getSize()).toBe(1);
            lifecycleStack.pop();
            _BUILD.WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH = false;
        });
    });

    function testFactory(bindToReference: IManagedResourceLinks)
    {
        const owner = testModule.wrapper.lifecycleStrategy.createNode(null);
        const someComponent = testModule.wrapper.lifecycleStrategy.createNode(null);
        owner.getLinked().link(someComponent);
        bindToReference.link(owner);
        return [owner, someComponent] as const;
    }
});
