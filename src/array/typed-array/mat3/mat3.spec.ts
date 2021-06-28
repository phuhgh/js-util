import { Mat3 } from "./mat3";
import { Vec2 } from "../vec2/vec2";

describe("=> Mat3", () =>
{
    describe("=> getElement", () =>
    {
        it("| returns expected values", () =>
        {
            const m4 = Mat3.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9);
            let counter = 1;

            for (let j = 0; j < 3; ++j)
            {
                for (let i = 0; i < 3; ++i)
                {
                    const index = Mat3.f32.getIndex(i, j);
                    expect(m4[index]).toBe(counter++);
                }
            }
        });
    });

    describe("=> createIdentityMatrix", () =>
    {
        it("| returns expected values", () =>
        {
            const m3 = Mat3.f32.createIdentityMatrix();

            for (let i = 0; i < 3; ++i)
            {
                for (let j = 0; j < 3; ++j)
                {
                    expect(m3[Mat3.f32.getIndex(i, j)]).toBe(i === j ? 1 : 0);
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
                .fill(1);
            Mat3.f32.createScalingMatrix(10, -10, m3);
            expect(m3[Mat3.f32.getIndex(0, 0)]).toBe(10);
            expect(m3[Mat3.f32.getIndex(1, 1)]).toBe(-10);
            expect(m3[Mat3.f32.getIndex(2, 2)]).toBe(1);

            for (let i = 0; i < 3; ++i)
            {
                for (let j = 0; j < 3; ++j)
                {
                    if (i !== j)
                    {
                        expect(m3[Mat3.f32.getIndex(i, j)]).toBe(0);
                    }
                }
            }
        });

        it("| multiplies as expected", () =>
        {
            const m3 = Mat3.f32.createScalingMatrix(2, 3);
            const v2 = Vec2.f32.factory.createOne(1, 1);
            const result = Vec2.f32.mat3Multiply(m3, v2);
            expect(Vec2.f32.getX(result)).toBe(2);
            expect(Vec2.f32.getY(result)).toBe(3);
        });
    });

    describe("=> createTranslationMatrix", () =>
    {
        it("| returns the expected matrix", () =>
        {
            const m3 = Mat3.f32.factory
                .createOneEmpty()
                .fill(1);
            Mat3.f32.createTranslationMatrix(10, -10, m3);
            expect(m3[Mat3.f32.getIndex(0, 2)]).toBe(10);
            expect(m3[Mat3.f32.getIndex(1, 2)]).toBe(-10);
            expect(m3[Mat3.f32.getIndex(0, 0)]).toBe(1);
            expect(m3[Mat3.f32.getIndex(1, 1)]).toBe(1);
            expect(m3[Mat3.f32.getIndex(2, 2)]).toBe(1);
            expect((m3).filter((value) => value === 0).length).toBe(4);
        });

        it("| multiplies as expected", () =>
        {
            const m3 = Mat3.f32.createTranslationMatrix(5, 7);
            const v2 = Vec2.f32.factory.createOne(1, 1);
            const result = Vec2.f32.mat3Multiply(m3, v2);
            expect(Vec2.f32.getX(result)).toBe(6);
            expect(Vec2.f32.getY(result)).toBe(8);
        });
    });

    describe("=> multiplyMat3", () =>
    {
        it("| returns the expected matrix", () =>
        {
            const identityMatrix = Mat3.f32.createIdentityMatrix();
            const m3 = Mat3.f32.createIdentityMatrix();
            const result = Mat3.f32.multiplyMat3(m3, identityMatrix);

            for (let i = 0; i < 3; ++i)
            {
                for (let j = 0; j < 3; ++j)
                {
                    expect(m3[Mat3.f32.getIndex(i, j)]).toBe(result[Mat3.f32.getIndex(i, j)]);
                }
            }
        });

        it("| multiplies as expected transform & scale", () =>
        {
            const m3t = Mat3.f32.createTranslationMatrix(5, 7);
            const m3s = Mat3.f32.createScalingMatrix(2, 3);
            const m3 = Mat3.f32.multiplyMat3(m3t, m3s);
            const v2 = Vec2.f32.factory.createOne(1, 1);
            const result = Vec2.f32.mat3Multiply(m3, v2);
            expect(Vec2.f32.getX(result)).toBe(12);
            expect(Vec2.f32.getY(result)).toBe(24);
        });

        it("| multiplies as expected scale & transform", () =>
        {
            const m3t = Mat3.f32.createTranslationMatrix(5, 7);
            const m3s = Mat3.f32.createScalingMatrix(2, 3);
            const m3 = Mat3.f32.multiplyMat3(m3s, m3t);
            const v2 = Vec2.f32.factory.createOne(1, 1);
            const result = Vec2.f32.mat3Multiply(m3, v2);
            expect(Vec2.f32.getX(result)).toBe(7);
            expect(Vec2.f32.getY(result)).toBe(10);
        });
    });
});
