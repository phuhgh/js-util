import { debugDescribe } from "../../../test-utils";
import { Mat3Factory } from "./mat3-factory";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { Mat3 } from "./mat3";

debugDescribe("=> Mat3Factory", () =>
{
    const factory = new Mat3Factory(Mat3.f32, NormalizedDataViewProvider.getView(Float32Array));

    describe("=> create one", () =>
    {
        it("| produces the expected array", () =>
        {
            const a = factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(a.length).toBe(9);
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
        });
    });

    describe("=> copyFromBuffer", () =>
    {
        it("| produces the expected array", () =>
        {
            const memory = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            const a = factory.copyFromBuffer(new DataView(memory.buffer), Float32Array.BYTES_PER_ELEMENT);
            expect(a.length).toBe(9);
            expect(a[0]).toBe(2);
            expect(a[8]).toBe(10);
        });
    });

    describe("=> copyToBuffer", () =>
    {
        it("| updates the buffer at the specified location", () =>
        {
            const a = factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const memory = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            factory.copyToBuffer(new DataView(memory.buffer), a, Float32Array.BYTES_PER_ELEMENT);
            expect(memory[0]).toBe(1);
            expect(memory[1]).toBe(1);
            expect(memory[9]).toBe(9);
            expect(memory[10]).toBe(11);
        });
    });

    describe("=> clone", () =>
    {
        it("| creates a copy", () =>
        {
            const a = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const b = Mat3.f32.factory.clone(a);
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
            expect(a.setIdentityMatrix).toBeDefined();
        });
    });
});