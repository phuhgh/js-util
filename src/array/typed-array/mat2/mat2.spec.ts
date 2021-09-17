import { Mat2, TF32Mat2 } from "./mat2";

describe("=> Mat2", () =>
{
    describe("=> getElement", () =>
    {
        it("| returns expected values", () =>
        {
            const m2 = Mat2.f32.factory.createOne(1, 2, 3, 4);
            let counter = 1;

            for (let j = 0; j < 2; ++j)
            {
                for (let i = 0; i < 2; ++i)
                {
                    expect(m2.getValueAt(i, j)).toBe(counter++);
                }
            }
        });
    });

    describe("=> createIdentityMatrix", () =>
    {
        it("| returns expected values", () =>
        {
            const m2 = Mat2.f32.factory
                .createOneEmpty()
                .setIdentityMatrix();

            for (let i = 0; i < 2; ++i)
            {
                for (let j = 0; j < 2; ++j)
                {
                    expect(m2.getValueAt(i, j)).toBe(i === j ? 1 : 0);
                }
            }
        });
    });

    describe("=> createScalingMatrix", () =>
    {
        it("| returns the expected matrix", () =>
        {
            const m2 = Mat2.f32.factory
                .createOneEmpty()
                .fill(1)
                .setScalingMatrix(10);

            expect(m2.getValueAt(0, 0)).toBe(10);
            expect(m2.getValueAt(1, 1)).toBe(1);
            expect(m2.getValueAt(0, 1)).toBe(0);
            expect(m2.getValueAt(1, 0)).toBe(0);
        });

        it("| multiplies as expected", () =>
        {
            const m2 = Mat2.f32.factory
                .createOneEmpty()
                .setScalingMatrix(2);

            expect(m2.getVec2MultiplyX(1)).toBe(2);
        });
    });

    describe("=> createTranslationMatrix", () =>
    {
        it("| returns the expected matrix", () =>
        {
            const m2 = Mat2.f32.factory
                .createOneEmpty()
                .fill(1)
                .setTranslationMatrix(10);
            expect(m2.getValueAt(0, 0)).toBe(1);
            expect(m2.getValueAt(1, 1)).toBe(1);
            expect(m2.getValueAt(0, 1)).toBe(10);
            expect(m2.getValueAt(1, 0)).toBe(0);
        });

        it("| multiplies as expected", () =>
        {
            const m2 = Mat2.f32.factory
                .createOneEmpty()
                .setTranslationMatrix(5);

            expect(m2.getVec2MultiplyX(1)).toBe(6);
        });
    });

    describe("=> multiplyMat2", () =>
    {
        it("| returns the expected matrix", () =>
        {
            const identityMatrix = Mat2.f32.factory
                .createOneEmpty()
                .setIdentityMatrix();
            const m2 = Mat2.f32.factory
                .createOneEmpty()
                .setIdentityMatrix();
            const result = m2.multiplyMat2(identityMatrix);

            for (let i = 0; i < 2; ++i)
            {
                for (let j = 0; j < 2; ++j)
                {
                    expect(m2.getValueAt(i, j)).toBe(result.getValueAt(i, j));
                }
            }
        });

        it("| multiplies as expected transform & scale", () =>
        {
            const m2t = Mat2.f32.factory
                .createOneEmpty()
                .setTranslationMatrix(5);
            const m2s = Mat2.f32.factory
                .createOneEmpty()
                .setScalingMatrix(2);
            const m2 = m2t.multiplyMat2(m2s);
            expect(m2.getVec2MultiplyX(1)).toBe(12);
        });

        it("| multiplies as expected scale & transform", () =>
        {
            const m2t = Mat2.f32.factory
                .createOneEmpty()
                .setTranslationMatrix(5);
            const m2s = Mat2.f32.factory
                .createOneEmpty()
                .setScalingMatrix(2);
            const m2 = m2s.multiplyMat2(m2t);
            expect(m2.getVec2MultiplyX(1)).toBe(7);
        });
    });

    describe("=> slice", () =>
    {
        it("| creates a copy", () =>
        {
            const a = Mat2.f32.factory.createOne(1, 2, 3, 4);
            const b: TF32Mat2 = a.slice();
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
            expect(a.setIdentityMatrix).toBeDefined();
        });
    });
});