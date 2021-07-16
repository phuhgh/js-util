import { Vec2 } from "../vec2/vec2";
import { Mat3 } from "./mat3";
import { Vec3 } from "../vec3/vec3";

describe("=> Mat3", () =>
{
    describe("=> getElement", () =>
    {
        it("| returns expected values", () =>
        {
            const m3 = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            let counter = 1;

            for (let j = 0; j < 3; ++j)
            {
                for (let i = 0; i < 3; ++i)
                {
                    expect(m3.getValueAt(i, j)).toBe(counter++);
                }
            }
        });
    });

    describe("=> createIdentityMatrix", () =>
    {
        it("| returns expected values", () =>
        {
            const m3 = Mat3.f32.factory
                .createOneEmpty()
                .setIdentityMatrix();

            for (let i = 0; i < 3; ++i)
            {
                for (let j = 0; j < 3; ++j)
                {
                    expect(m3.getValueAt(i, j)).toBe(i === j ? 1 : 0);
                }
            }
        });
    });

    describe("=> createScalingMatrix", () =>
    {
        it("| returns the expected matrix", () =>
        {
            const m3 = Mat3.f32.factory
                .createOneEmpty()
                .fill(1)
                .setScalingMatrix(10, -10);
            expect(m3.getValueAt(0, 0)).toBe(10);
            expect(m3.getValueAt(1, 1)).toBe(-10);
            expect(m3.getValueAt(2, 2)).toBe(1);

            for (let i = 0; i < 3; ++i)
            {
                for (let j = 0; j < 3; ++j)
                {
                    if (i !== j)
                    {
                        expect(m3.getValueAt(i, j)).toBe(0);
                    }
                }
            }
        });

        it("| multiplies as expected", () =>
        {
            const m3 = Mat3.f32.factory
                .createOneEmpty()
                .setScalingMatrix(2, 3);
            const v2 = Vec2.f32.factory.createOne(1, 1);
            const result = v2.mat3Multiply(m3);
            expect(result.getX()).toBe(2);
            expect(result.getY()).toBe(3);
        });
    });

    describe("=> createTranslationMatrix", () =>
    {
        it("| returns the expected matrix", () =>
        {
            const m3 = Mat3.f32.factory
                .createOneEmpty()
                .fill(1)
                .setTranslationMatrix(10, -10);
            expect(m3.getValueAt(0, 2)).toBe(10);
            expect(m3.getValueAt(1, 2)).toBe(-10);
            expect(m3.getValueAt(0, 0)).toBe(1);
            expect(m3.getValueAt(1, 1)).toBe(1);
            expect(m3.getValueAt(2, 2)).toBe(1);
            expect(m3.filter((value) => value === 0).length).toBe(4);
        });

        it("| multiplies as expected", () =>
        {
            const m3 = Mat3.f32.factory
                .createOneEmpty()
                .setTranslationMatrix(5, 7);
            const v2 = Vec2.f32.factory.createOne(1, 1);
            const result = v2.mat3Multiply(m3);
            expect(result.getX()).toBe(6);
            expect(result.getY()).toBe(8);
        });
    });

    describe("=> multiplyMat3", () =>
    {
        it("| returns the expected matrix", () =>
        {
            const identityMatrix = Mat3.f32.factory
                .createOneEmpty()
                .setIdentityMatrix();
            const m3 = Mat3.f32.factory
                .createOneEmpty()
                .setIdentityMatrix();
            const result = m3.multiplyMat3(identityMatrix);

            for (let i = 0; i < 3; ++i)
            {
                for (let j = 0; j < 3; ++j)
                {
                    expect(m3.getValueAt(i, j)).toBe(result.getValueAt(i, j));
                }
            }
        });

        it("| multiplies as expected transform & scale", () =>
        {
            const m3t = Mat3.f32.factory
                .createOneEmpty()
                .setTranslationMatrix(5, 7);
            const m3s = Mat3.f32.factory
                .createOneEmpty()
                .setScalingMatrix(2, 3);
            const m3 = m3t.multiplyMat3(m3s);
            const v2 = Vec2.f32.factory.createOne(1, 1);
            const result = v2.mat3Multiply(m3);
            expect(result.getX()).toBe(12);
            expect(result.getY()).toBe(24);
        });

        it("| multiplies as expected scale & transform", () =>
        {
            const m3t = Mat3.f32.factory
                .createOneEmpty()
                .setTranslationMatrix(5, 7);
            const m3s = Mat3.f32.factory
                .createOneEmpty()
                .setScalingMatrix(2, 3);
            const m3 = m3s.multiplyMat3(m3t);
            const v2 = Vec2.f32.factory.createOne(1, 1);
            const result = v2.mat3Multiply(m3);
            expect(result.getX()).toBe(7);
            expect(result.getY()).toBe(10);
        });
    });

    describe("=> slice", () =>
    {

        it("| calls into the native method", () =>
        {
            const m3 = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const slice = m3.slice(1, 3);
            expect(slice.length).toBe(2);
            expect(slice[0]).toBe(2);
            expect(slice[1]).toBe(3);
        });
    });

    describe("=> subarray", () =>
    {
        it("| calls into the native method", () =>
        {
            const m3 = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const slice = m3.subarray(1, 3);
            expect(slice.length).toBe(2);
            expect(slice[0]).toBe(2);
            expect(slice[1]).toBe(3);
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
            expect(identityMatrix.getVec3MultiplyX(v.getX())).toBe(1);
            expect(identityMatrix.getVec3MultiplyY(v.getY())).toBe(2);

            const txMatrix = Mat3.f32.factory.createOneEmpty().setTranslationMatrix(10, -10);
            expect(txMatrix.getVec3MultiplyX(v.getX())).toBe(11);
            expect(txMatrix.getVec3MultiplyY(v.getY())).toBe(-8);
        });
    });

    describe("=> setValueAt", () =>
    {
        it("| sets the expected element", () =>
        {
            const m4 = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            m4.setValueAt(0, 2, 99);
            expect(m4[6]).toBe(99);
        });
    });

    describe("=> getRow", () =>
    {
        it("| returns rows as vec3", () =>
        {
            const a = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(a.getRow(2)).toEqual(Vec3.f32.factory.createOne(7, 8, 9));
        });
    });

    describe("=> setRow", () =>
    {
        it("| modifies the array as expected", () =>
        {
            const a = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            a.setRow(2, Vec3.f32.factory.createOne(1, 2, 3));
            expect(a).toEqual(Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 1, 2, 3));
        });
    });
});
