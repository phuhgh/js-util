import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";
import { blockScope } from "./block-scoped-lifecycle.js";
import { SanitizedEmscriptenTestModule } from "../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { getTestModuleOptions } from "../test-util/test-utils.js";
import utilTestModule from "../external/test-module.mjs";
import type { IManagedResourceNode } from "./manged-resources.js";
import { _Fp } from "../fp/_fp.js";

describe("=> LinkedReferences", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());

    beforeEach(async () =>
    {
        Test_setDefaultFlags();
        await testModule.initialize();
    });

    afterEach(() => testModule.endEmscriptenProgram());

    describe("linkRef", () =>
    {
        it("| errors if a cycle is detected", _Fp.runWithin([blockScope], () =>
        {
            const a = testModule.wrapper.lifecycleStrategy.createNode(null);
            const b = testModule.wrapper.lifecycleStrategy.createNode(null);
            a.getLinked().link(b);
            expect(() => b.getLinked().link(a)).toThrow();
        }));
    });

    describe("=> unlinkAll", () =>
    {
        it("| calls ref's onRelease with the expected owner", () =>
        {
            const owner = testModule.wrapper.lifecycleStrategy.createNode(testModule.wrapper.rootNode);
            const child = testModule.wrapper.lifecycleStrategy.createNode(owner);
            const releaseSpy = spyOn(child, "onReleased").and.callThrough();

            expect(child.getIsDestroyed()).toBe(false);
            expect(owner.getIsDestroyed()).toBe(false);

            owner.getLinked().unlinkAll();
            expect(child.getIsDestroyed()).toBe(true);
            expect(owner.getIsDestroyed()).toBe(false);
            expect(releaseSpy).toHaveBeenCalledWith(owner);
        });
    });

    describe("=> on free listener", () =>
    {
        it("| is called on free", () =>
        {
            const owner = testModule.wrapper.lifecycleStrategy.createNode(testModule.wrapper.rootNode);
            const spy = jasmine.createSpy();
            owner.onFreeChannel.addListener({ onFree: spy });

            owner.getLinked().unlinkAll();
            expect(spy).not.toHaveBeenCalled();

            testModule.wrapper.rootNode.getLinked().unlinkAll();
            expect(spy).toHaveBeenCalled();
        });
    });

    it("| clears all linked refs on free", () =>
    {
        const root = testModule.wrapper.lifecycleStrategy.createNode(testModule.wrapper.rootNode);
        let child!: IManagedResourceNode;

        blockScope(() =>
        {
            child = testModule.wrapper.lifecycleStrategy.createNode(root);
            expect(child.getIsDestroyed()).toBe(false);
        });

        root.getLinked().unlinkAll();
        expect(child.getIsDestroyed()).toBe(true);
    });
});
