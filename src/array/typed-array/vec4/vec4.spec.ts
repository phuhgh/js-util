import { Vec4 } from "./vec4";

describe("=> Vec4", () =>
{
    describe("=> getters", () =>
    {
        it("| provides the expected values", () =>
        {
            const v = Vec4.f32.factory.createOne(1, 2, 3, 4);
            expect(Vec4.f32.getX(v)).toBe(1);
            expect(Vec4.f32.getY(v)).toBe(2);
            expect(Vec4.f32.getZ(v)).toBe(3);
            expect(Vec4.f32.getW(v)).toBe(4);

        });
    });

    describe("=> setters", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec4.f32.factory.createOneEmpty();
            Vec4.f32.setX(v, 1);
            Vec4.f32.setY(v, 2);
            Vec4.f32.setZ(v, 3);
            Vec4.f32.setW(v, 4);

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(2);
            expect(v[2]).toBe(3);
            expect(v[3]).toBe(4);
        });
    });

    describe("=> update", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec4.f32.factory.createOneEmpty();
            Vec4.f32.update(v, 1, 2, 3, 4);

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(2);
            expect(v[2]).toBe(3);
            expect(v[3]).toBe(4);
        });
    });
});