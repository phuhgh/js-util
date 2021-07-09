import { debugDescribe } from "../../../test-utils";
import { Mat2Factory } from "./mat2-factory";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { Mat2 } from "./mat2";

debugDescribe("=> Mat2Factory", () =>
{
    const factory = new Mat2Factory(Mat2.f64, NormalizedDataViewProvider.getView(Float64Array));

    describe("=> create one", () =>
    {
        it("| produces the expected array", () =>
        {
            const a = factory.createOne(1, 2, 3, 4);
            expect(a.length).toBe(4);
            // noinspection SuspiciousTypeOfGuard
            expect(a instanceof Float64Array).toBe(true);
            expect(a[0]).toBe(1);
            expect(a[1]).toBe(2);
            expect(a[2]).toBe(3);
            expect(a[3]).toBe(4);
        });
    });

    describe("=> copyFromBuffer", () =>
    {
        it("| produces the expected array", () =>
        {
            const memory = new Float64Array([1, 2, 3, 4, 5, 6, 7, 8]);
            const a = factory.copyFromBuffer(new DataView(memory.buffer), Float64Array.BYTES_PER_ELEMENT);
            expect(a.length).toBe(4);
            expect(a[0]).toBe(2);
            expect(a[1]).toBe(3);
            expect(a[2]).toBe(4);
            expect(a[3]).toBe(5);
        });
    });

    describe("=> copyToBuffer", () =>
    {
        it("| updates the buffer at the specified location", () =>
        {
            const a = factory.createOne(1, 2, 3, 4);
            const memory = new Float64Array([1, 2, 3, 4, 5, 6, 7, 8]);

            factory.copyToBuffer(new DataView(memory.buffer), a, Float64Array.BYTES_PER_ELEMENT);
            expect(memory[0]).toBe(1);
            expect(memory[1]).toBe(1);
            expect(memory[2]).toBe(2);
            expect(memory[3]).toBe(3);
            expect(memory[4]).toBe(4);
            expect(memory[5]).toBe(6);
        });
    });

    describe("=> clone", () =>
    {
        it("| creates a copy", () =>
        {
            const a = Mat2.f32.factory.createOne(1, 2, 3, 4);
            const b = Mat2.f32.factory.clone(a);
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
            expect(a.setIdentityMatrix).toBeDefined();
        });
    });
});