import { geWasmTestMemory } from "../get-wasm-test-memory";
import { getEmscriptenWrapper } from "../emscripten/get-emscripten-wrapper";
import { _Debug } from "../../debug/_debug";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper";
import { Emscripten } from "../../../external/emscripten";
import { SharedArray, TSharedArrayF32 } from "./shared-array";


declare const require: (path: string) => Emscripten.EmscriptenModuleFactory;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Module = require("../../../external/test-module");

describe("=> F32SharedArray", () =>
{
    let wrapper: IEmscriptenWrapper;

    beforeEach(() =>
    {
        _Debug.setFlag("DEBUG_MODE", true);
        _Debug.setFlag("DEBUG_DISABLE_BREAKPOINT", true);
    });

    beforeAll(async () =>
    {
        const memory = geWasmTestMemory();
        wrapper = await getEmscriptenWrapper(memory, Module);
    });

    describe("=> lifecycle", () =>
    {
        it("| cleans up after itself on release", () =>
        {
            const sharedArray1 = SharedArray.createOneF32(wrapper, 8);
            const sharedArray1Address = sharedArray1.getPtr();
            sharedArray1.release();
            const sharedArray2 = SharedArray.createOneF32(wrapper, 8);
            const sharedArray2Address = sharedArray2.getPtr();
            sharedArray2.release();
            expect(sharedArray1Address).toEqual(sharedArray2Address);
        });
    });

    describe("=> getInstance", () =>
    {
        let sharedArray: TSharedArrayF32;

        beforeEach(() =>
        {
            sharedArray = SharedArray.createOneF32(wrapper, 8);
        });

        it("| creates an array of the correct length", () =>
        {
            const actualArray = sharedArray.getInstance();
            expect(actualArray.length).toBe(8);
            sharedArray.release();
        });

        it("| errors when called after release (debug)", () =>
        {
            sharedArray.release();
            expect(() => sharedArray.getInstance()).toThrow();
        });

        it("| returns an empty array when called after release (prod)", () =>
        {
            _Debug.setFlag("DEBUG_MODE", false);
            sharedArray.release();
            expect(sharedArray.getInstance()).toBeInstanceOf(Float32Array);
        });
    });
});