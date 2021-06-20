import { Vec3 } from "./vec3";
import { Mat3 } from "../mat3/mat3";

describe("=> Vec3", () =>
{
    describe("=> getters", () =>
    {
        it("| provides the expected values", () =>
        {
            const v = Vec3.f32.factory.createOne(1, 2, 3);
            expect(Vec3.f32.getX(v)).toBe(1);
            expect(Vec3.f32.getY(v)).toBe(2);
            expect(Vec3.f32.getZ(v)).toBe(3);

        });
    });

    describe("=> setters", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec3.f32.factory.createOneEmpty();
            Vec3.f32.setX(v, 1);
            Vec3.f32.setY(v, 2);
            Vec3.f32.setZ(v, 3);

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(2);
            expect(v[2]).toBe(3);
        });
    });

    describe("=> update", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec3.f32.factory.createOneEmpty();
            Vec3.f32.update(v, 1, 2,3 );

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(2);
            expect(v[2]).toBe(3);
        });
    });

    describe("=> mat3 multiply component wise", () =>
    {
        it("| returns the expected values", () =>
        {
            const v = Vec3.f32.factory.createOne(1, 2, 0);
            const identityMatrix = Mat3.f32.createIdentityMatrix();
            expect(Vec3.f32.getMat3MultiplyX(identityMatrix, v[0])).toBe(1);
            expect(Vec3.f32.getMat3MultiplyY(identityMatrix, v[1])).toBe(2);

            const txMatrix = Mat3.f32.createTranslationMatrix(10, -10);
            expect(Vec3.f32.getMat3MultiplyX(txMatrix, v[0])).toBe(11);
            expect(Vec3.f32.getMat3MultiplyY(txMatrix, v[1])).toBe(-8);
        });
    });
});