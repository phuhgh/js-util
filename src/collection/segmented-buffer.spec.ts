import utilTestModule from "../external/util-test-module.mjs";
import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";
import { SanitizedEmscriptenTestModule } from "../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { getTestModuleOptions } from "../test-util/test-utils.js";
import { _Fp } from "../fp/_fp.js";
import { blockScope } from "../lifecycle/block-scoped-lifecycle.js";
import { SharedArray } from "../web-assembly/shared-array/shared-array.js";
import { createSegmentedBufferView, SegmentedBufferDescriptor } from "./segmented-buffer-view.js";
import { _Array } from "../array/_array.js";

describe("=> createSegmentedBufferView", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());

    beforeEach(async () =>
    {
        Test_setDefaultFlags();
        await testModule.initialize();
    });

    afterEach(() =>
    {
        testModule.endEmscriptenProgram();
    });

    it("| correctly handles lifecycle", _Fp.runWithin([blockScope], () =>
    {
        const view = createDataView(new SegmentedBufferDescriptor(2));
        const descriptor = view.getDescriptor();
        const array = view.getBuffer().getArray();
        expect(view.getDescriptor().count).toBe(5);

        const foundSlot1: number[] = [];
        const foundSlot2: number[] = [];
        for (let i = descriptor.start, iEnd = descriptor.end, stride = descriptor.stride; i < iEnd; i += stride)
        {
            foundSlot1.push(array[i]);
            foundSlot2.push(array[i + 1]);
        }

        expect(foundSlot1).toEqual([10, 12, 14, 16, 18]);
        expect(foundSlot2).toEqual([11, 13, 15, 17, 19]);

        testModule.wrapper.destroyLinked();
    }));

    it("| correctly handles offset", _Fp.runWithin([blockScope], () =>
    {
        const view = createDataView(new SegmentedBufferDescriptor(2, 2, 4));
        const descriptor = view.getDescriptor();
        const array = view.getBuffer().getArray();
        expect(view.getDescriptor().count).toBe(3);

        const foundSlot1: number[] = [];
        const foundSlot2: number[] = [];
        for (let i = descriptor.start, iEnd = descriptor.end, stride = descriptor.stride; i < iEnd; i += stride)
        {
            foundSlot1.push(array[i]);
            foundSlot2.push(array[i + 1]);
        }

        expect(foundSlot1).toEqual([14, 16, 18]);
        expect(foundSlot2).toEqual([15, 17, 19]);

        testModule.wrapper.destroyLinked();
    }));

    function createDataView(descriptor: SegmentedBufferDescriptor)
    {
        const sa = SharedArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 10);
        _Array.forEachRange(10, 19, (val, index) =>
        {
            sa.getArray()[index] = val;
        });

        return createSegmentedBufferView(sa, descriptor, testModule.wrapper, sa.resourceHandle);
    }
});
