import { Mat2 } from "./mat2";

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
                    const index = Mat2.f32.getElement(i, j);
                    expect(m2[index]).toBe(counter++);
                }
            }
        });
    });

    describe("=> createIdentityMatrix", () =>
    {
        it("| returns expected values", () =>
        {
            const m2 = Mat2.f32.createIdentityMatrix();

            for (let i = 0; i < 2; ++i)
            {
                for (let j = 0; j < 2; ++j)
                {
                    expect(m2[Mat2.f32.getElement(i, j)]).toBe(i === j ? 1 : 0);
                }
            }
        });
    });
});