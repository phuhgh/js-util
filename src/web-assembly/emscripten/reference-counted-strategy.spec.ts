import { ReferenceCountedNode } from "../../lifecycle/reference-counted-node.js";
import { lifecycleStack } from "./lifecycle-stack.js";
import { IManagedObject, type IManagedResourceNode } from "../../lifecycle/manged-resources.js";
import { ReferenceCountedStrategy } from "./reference-counted-strategy.js";
import { _Debug } from "../../debug/_debug.js";
import { SanitizedEmscriptenTestModule } from "./sanitized-emscripten-test-module.js";
import { getTestModuleOptions, TestGarbageCollector } from "../../test-util/test-utils.js";
import utilTestModule from "../../external/test-module.mjs";
import { SharedArray } from "../shared-array/shared-array.js";
import type { IJsUtilBindings } from "../i-js-util-bindings.js";
import type { IEmscriptenWrapper } from "./i-emscripten-wrapper.js";
import type { IInteropBindings } from "./i-interop-bindings.js";


describe("=> ReferenceCountedStrategy", () =>
{
    let strategy: ReferenceCountedStrategy;

    beforeEach(() =>
    {
        strategy = new ReferenceCountedStrategy();
    });

    it("| creates nodes bound to the last block scope", () =>
    {
        const blockNode = new ReferenceCountedNode();
        spyOn(lifecycleStack, "getTop").and.returnValue(blockNode);
        spyOn(lifecycleStack, "push").and.returnValue(blockNode);
        spyOn(blockNode.getLinked(), "link").and.callThrough();

        const node = strategy.createNode(null);

        expect(blockNode.getLinked().link).toHaveBeenCalledWith(node);
        expect(blockNode.getLinked().isLinkedTo(node)).toBe(true);
        blockNode.getLinked().unlinkAll();
        expect(node.getIsDestroyed()).toBe(true);
    });

    it("| creates root nodes", () =>
    {
        const rootNode = strategy.createRootNode();
        expect(rootNode.getIsDestroyed()).toBe(false);
        expect(rootNode.getLinked().getLinkedNodes().length).toBe(0);
    });

    it("| provides finalization checks in debug for pointers", async () =>
    {
        if (!_BUILD.DEBUG || !TestGarbageCollector.isAvailable)
        {
            return pending("Test not available in this environment");
        }

        const errorSpy = spyOn(_Debug, "error");
        const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());
        await testModule.initialize();
        expect(errorSpy).not.toHaveBeenCalled();

        // this is an error in all cases with reference counting (forgot to use return)
        SharedArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 100);
        expect(await TestGarbageCollector.testFriendlyGc()).toBeGreaterThan(0);

        expect(errorSpy).toHaveBeenCalledWith(jasmine.stringMatching(/^A shared object was leaked/));
        testModule.wrapper.rootNode.getLinked().unlinkAll();
        testModule.endEmscriptenProgram();
    });

    it("| provides finalization checks in debug", async () =>
    {
        if (!_BUILD.DEBUG || !TestGarbageCollector.isAvailable)
        {
            return pending("Test not available in this environment");
        }

        const errorSpy = spyOn(_Debug, "error");
        const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());
        await testModule.initialize();
        expect(errorSpy).not.toHaveBeenCalled();

        // leak the object while registering it
        testModule.wrapper.lifecycleStrategy.onManagedObjectCreated(createTestManagedObject(testModule));

        expect(await TestGarbageCollector.testFriendlyGc()).toBeGreaterThan(0);
        expect(errorSpy).toHaveBeenCalled();
        testModule.wrapper.rootNode.getLinked().unlinkAll();
        testModule.endEmscriptenProgram();
    });
});

class TestManagedObject implements IManagedObject
{
    public constructor(
        public resourceHandle: IManagedResourceNode
    )
    {
    }

    public getWrapper(): IEmscriptenWrapper<IInteropBindings>
    {
        throw new Error("not implemented");
    }
}

function createTestManagedObject(testModule: SanitizedEmscriptenTestModule<IJsUtilBindings, object>): IManagedObject
{
    return new TestManagedObject(testModule.wrapper.lifecycleStrategy.createNode(testModule.wrapper.rootNode));
}
