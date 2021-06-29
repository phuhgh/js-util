import { Vec4 } from "./vec4";

describe("=> Vec4", () =>
{
    describe("=> getters", () =>
    {
        it("| provides the expected values", () =>
        {
            const v = Vec4.f32.factory.createOne(1, 2, 3, 4);
            expect(v.getX()).toBe(1);
            expect(v.getY()).toBe(2);
            expect(v.getZ()).toBe(3);
            expect(v.getW()).toBe(4);

        });
    });

    describe("=> setters", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec4.f32.factory.createOneEmpty();
            v.setX(1);
            v.setY(2);
            v.setZ(3);
            v.setW(4);

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
            v.update(1, 2, 3, 4);

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(2);
            expect(v[2]).toBe(3);
            expect(v[3]).toBe(4);
        });
    });
});