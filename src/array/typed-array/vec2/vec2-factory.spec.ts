import { debugDescribe } from "../../../test-utils";
import { Vec2Factory } from "./vec2-factory";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { Vec2 } from "./vec2";

debugDescribe("=> Vec2Factory", () =>
{
    const factory = new Vec2Factory(Vec2.f32, NormalizedDataViewProvider.getView(Float32Array));

    describe("=> create one", () =>
    {
        it("| produces the expected array", () =>
        {
            const a = factory.createOne(1, 2);
            expect(a.length).toBe(2);
            // noinspection SuspiciousTypeOfGuard
            expect(a instanceof Float32Array).toBe(true);
            expect(a[0]).toBe(1);
            expect(a[1]).toBe(2);
        });
    });

    describe("=> copyFromBuffer", () =>
    {
        it("| produces the expected array", () =>
        {
            const memory = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
            const a = factory.copyFromBuffer(new DataView(memory.buffer), Float32Array.BYTES_PER_ELEMENT);
            expect(a.length).toBe(2);
            expect(a[0]).toBe(2);
            expect(a[1]).toBe(3);
        });
    });

    describe("=> copyToBuffer", () =>
    {
        it("| updates the buffer at the specified location", () =>
        {
            const a = factory.createOne(1, 2);
            const memory = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);

            factory.copyToBuffer(new DataView(memory.buffer), a, Float32Array.BYTES_PER_ELEMENT);
            expect(memory[0]).toBe(1);
            expect(memory[1]).toBe(1);
            expect(memory[2]).toBe(2);
            expect(memory[3]).toBe(4);
            expect(memory[4]).toBe(5);
            expect(memory[5]).toBe(6);
        });
    });
});