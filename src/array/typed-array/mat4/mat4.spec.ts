import { Mat4 } from "./mat4";

describe("=> Mat4", () =>
{
    describe("=> getElement", () =>
    {
        it("| returns expected values", () =>
        {
            const m4 = Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            let counter = 1;

            for (let j = 0; j < 4; ++j)
            {
                for (let i = 0; i < 4; ++i)
                {
                    expect(m4.getValueAt(i, j)).toBe(counter++);
                }
            }
        });
    });

    describe("=> createIdentityMatrix", () =>
    {
        it("| returns expected values", () =>
        {
            const m4 = Mat4.f32.factory
                .createOneEmpty()
                .setIdentityMatrix();

            for (let i = 0; i < 4; ++i)
            {
                for (let j = 0; j < 4; ++j)
                {
                    expect(m4.getValueAt(i, j)).toBe(i === j ? 1 : 0);
                }
            }
        });
    });

    describe("=> set", () =>
    {
        it("| sets the values after the index", () =>
        {
            const m4 = Mat4.f32.factory
                .createOneEmpty()
                .setIdentityMatrix();

            m4.set([1, 2, 3, 4], 4);

            expect(m4[4]).toBe(1);
            expect(m4[7]).toBe(4);
        });
    });
});