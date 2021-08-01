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