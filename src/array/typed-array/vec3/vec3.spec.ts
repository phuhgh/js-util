import { Vec3 } from "./vec3";
import { Mat3 } from "../mat3/mat3";

describe("=> Vec3", () =>
{
    describe("=> getters", () =>
    {
        it("| provides the expected values", () =>
        {
            const v = Vec3.f32.factory.createOne(1, 2, 3);
            expect(v.getX()).toBe(1);
            expect(v.getY()).toBe(2);
            expect(v.getZ()).toBe(3);

        });
    });

    describe("=> setters", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec3.f32.factory.createOneEmpty();
            v.setX(1);
            v.setY(2);
            v.setZ(3);

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
            v.update(1, 2, 3);

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
            const identityMatrix = Mat3.f32.factory
                .createOneEmpty()
                .setIdentityMatrix();
            expect(v.getMat3MultiplyX(identityMatrix)).toBe(1);
            expect(v.getMat3MultiplyY(identityMatrix)).toBe(2);

            const txMatrix = Mat3.f32.factory.createOneEmpty().setTranslationMatrix(10, -10);
            expect(v.getMat3MultiplyX(txMatrix)).toBe(11);
            expect(v.getMat3MultiplyY(txMatrix)).toBe(-8);
        });
    });
});