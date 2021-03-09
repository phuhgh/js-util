import { Vec2 } from "./vec2";

describe("=> Vec2", () =>
{
    describe("=> getters", () =>
    {
        it("| provides the expected values", () =>
        {
            const v = Vec2.f32.factory.createOne(1, 2);
            expect(Vec2.f32.getX(v)).toBe(1);
            expect(Vec2.f32.getY(v)).toBe(2);

        });
    });

    describe("=> setters", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec2.f32.factory.createOneEmpty();
            Vec2.f32.setX(v, 1);
            Vec2.f32.setY(v, 2);

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(2);
        });
    });

    describe("=> dotProduct", () =>
    {
        it("| returns expected value", () =>
        {
            const a = Vec2.f32.factory.createOne(1, 2);
            const b = Vec2.f32.factory.createOne(3, 4);
            const r = Vec2.f32.dotProduct(a,b);

            expect(r[0]).toBe(3);
            expect(r[1]).toBe(8);
        });
    });
});