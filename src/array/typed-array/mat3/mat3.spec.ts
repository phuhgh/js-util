import { Vec2 } from "../vec2/vec2.js";
import { Mat3, TF32Mat3 } from "./mat3.js";
import { Vec3 } from "../vec3/vec3.js";
import { Test_setDefaultFlags } from "../../../test-util/test_set-default-flags.js";

describe("=> Mat3", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

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

        describe("=> compile checks", () =>
        {
            it("allows different input types", () =>
            {
                const m3t = Mat3.f32.factory
                    .createOneEmpty()
                    .setTranslationMatrix(5, 7);
                const m3s = Mat3.u8.factory
                    .createOneEmpty()
                    .setScalingMatrix(2, 3);
                const result = m3s.multiplyMat3(m3t);
                expect(result).toBeInstanceOf(Mat3.u8);
            });

            it("allows different output types", () =>
            {
                const m3t = Mat3.f32.factory
                    .createOneEmpty()
                    .setTranslationMatrix(5, 7);
                const m3s = Mat3.u8.factory
                    .createOneEmpty()
                    .setScalingMatrix(2, 3);

                const result = Mat3.u16.factory.createOneEmpty();
                const returnedResult: Mat3<Uint16Array> = m3s.multiplyMat3(m3t, result);
                expect(returnedResult).toBeInstanceOf(Mat3.u16);
            });
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

    describe("=> slice", () =>
    {
        it("| creates a copy", () =>
        {
            const a = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const b: TF32Mat3 = a.slice();
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
            expect(a.setIdentityMatrix).toBeDefined();
        });
    });

    describe("=> scalarAdd", () =>
    {
        it("| adds", () =>
        {
            const a = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(a.scalarAdd(1)).toEqual(a.map(x => x + 1));
        });
    });

    describe("=> scalarMultiply", () =>
    {
        it("| multiplies", () =>
        {
            const a = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(a.scalarMultiply(2)).toEqual(a.map(x => x * 2));
        });
    });

    describe("=> isEqualTo", () =>
    {
        it("| returns true if all components are the same", () =>
        {
            const a = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            const b = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);

            expect(a.isEqualTo(b)).toBe(true);
        });

        it("| returns false if any component is different", () =>
        {
            const a1 = Mat3.f32.factory.createOne(0, 2, 3, 4, 5, 6, 7, 8, 9);
            const b1 = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(a1.isEqualTo(b1)).toBe(false);

            const a2 = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 0);
            const b2 = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            expect(a2.isEqualTo(b2)).toBe(false);
        });
    });
});
