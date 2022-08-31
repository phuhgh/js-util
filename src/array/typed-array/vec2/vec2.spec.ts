import { TF32Vec2, Vec2 } from "./vec2";
import { Mat3 } from "../mat3/mat3";
import { Range2d } from "../2d/range2d/range2d";
import { setDefaultUnitTestFlags } from "../../../test-util/set-default-unit-test-flags";

describe("=> Vec2", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

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

            expect(r).toBe(11);
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

    describe("=> bound", () =>
    {
        it("| bounds up", () =>
        {
            const v = Vec2.f32.factory.createOne(0, 0);
            const range = Range2d.f32.factory.createOne(2, 4, 2, 4);
            v.bound2d(range);
            expect(v).toEqual(Vec2.f32.factory.createOne(2, 2));
        });

        it("| bounds down", () =>
        {
            const v = Vec2.f32.factory.createOne(6, 6);
            const range = Range2d.f32.factory.createOne(2, 4, 2, 4);
            v.bound2d(range);
            expect(v).toEqual(Vec2.f32.factory.createOne(4, 4));
        });

        it("| leaves values that are bounded", () =>
        {
            const v = Vec2.f32.factory.createOne(1, 1);
            const range = Range2d.f32.factory.createOne(0, 4, 0, 4);
            v.bound2d(range);
            expect(v).toEqual(Vec2.f32.factory.createOne(1, 1));
        });
    });

    describe("=> slice", () =>
    {
        it("| creates a copy", () =>
        {
            const a = Vec2.f32.factory.createOne(1, 2);
            const b: TF32Vec2 = a.slice();
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
            expect(a.getX).toBeDefined();
        });
    });

    describe("=> normalize", () =>
    {
        it("| returns a unit vector in the same direction", () =>
        {
            const a = Vec2.f32.factory.createOne(10, 10);
            expect(a.normalize()).toEqual(Vec2.f32.factory.createOne(1 / Math.sqrt(2), 1 / Math.sqrt(2)));
        });
    });

    describe("=> getNormal", () =>
    {
        it("| returns a normal to the vector", () =>
        {
            const a = Vec2.f32.factory.createOne(1, 2);
            expect(a.getNormal()).toEqual(Vec2.f32.factory.createOne(2, -1));
        });
    });
});