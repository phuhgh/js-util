import { Mat4Factory } from "./mat4-factory.js";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider.js";
import { Mat4 } from "./mat4.js";
import { setDefaultUnitTestFlags } from "../../../test-util/set-default-unit-test-flags.js";

describe("=> Mat4Factory", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    const factory = new Mat4Factory(Mat4.f32, NormalizedDataViewProvider.getView(Float32Array));
    const a = factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

    describe("=> create one", () =>
    {
        it("| produces the expected array", () =>
        {
            expect(a.length).toBe(16);
            // noinspection SuspiciousTypeOfGuard
            expect(a instanceof Float32Array).toBe(true);
            expect(a[0]).toBe(1);
            expect(a[1]).toBe(2);
            expect(a[2]).toBe(3);
            expect(a[3]).toBe(4);
            expect(a[4]).toBe(5);
            expect(a[5]).toBe(6);
            expect(a[6]).toBe(7);
            expect(a[7]).toBe(8);
            expect(a[8]).toBe(9);
            expect(a[9]).toBe(10);
            expect(a[10]).toBe(11);
            expect(a[11]).toBe(12);
            expect(a[12]).toBe(13);
            expect(a[13]).toBe(14);
            expect(a[14]).toBe(15);
            expect(a[15]).toBe(16);
        });
    });

    describe("=> copyFromBuffer", () =>
    {
        it("| produces the expected array", () =>
        {
            const memory = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
            const a = factory.copyFromBuffer(new DataView(memory.buffer), Float32Array.BYTES_PER_ELEMENT);
            expect(a.length).toBe(16);
            expect(a[0]).toBe(2);
            expect(a[15]).toBe(17);
        });
    });

    describe("=> copyToBuffer", () =>
    {
        it("| updates the buffer at the specified location", () =>
        {
            const memory = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
            factory.copyToBuffer(new DataView(memory.buffer), a, Float32Array.BYTES_PER_ELEMENT);
            expect(memory[0]).toBe(1);
            expect(memory[1]).toBe(1);
            expect(memory[16]).toBe(16);
            expect(memory[17]).toBe(18);
        });
    });
});