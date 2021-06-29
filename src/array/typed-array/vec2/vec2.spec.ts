import { Vec2 } from "./vec2";
import { Mat3 } from "../mat3/mat3";

describe("=> Vec2", () =>
{
    describe("=> getters", () =>
    {
        it("| provides the expected values", () =>
        {
            const v = Vec2.f32.factory.createOne(1, 2);
            expect(v.getX()).toBe(1);
            expect(v.getY()).toBe(2);

        });
    });

    describe("=> setters", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec2.f32.factory.createOneEmpty();
            v.setX(1);
            v.setY(2);

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(2);
        });
    });

    describe("=> update", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec2.f32.factory.createOneEmpty();
            v.update(1, 2);

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
            const r = a.dotProduct(b);

            expect(r[0]).toBe(3);
            expect(r[1]).toBe(8);
        });
    });

    describe("=> mat3 multiply", () =>
    {
        it("| returns the expected values", () =>
        {
            const v = Vec2.f32.factory.createOne(1, 2);
            const identityMatrix = Mat3.f32.factory
                .createOneEmpty()
                .setIdentityMatrix();
            const result = v.mat3Multiply(identityMatrix);
            expect(result[0]).toBe(1);
            expect(result[1]).toBe(2);

            const txMatrix = Mat3.f32.factory
                .createOneEmpty()
                .setTranslationMatrix(10, -10);
            const result2 = v.mat3Multiply(txMatrix);
            expect(result2[0]).toBe(11);
            expect(result2[1]).toBe(-8);
        });
    });
});