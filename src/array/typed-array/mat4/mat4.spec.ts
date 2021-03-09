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
                    const index = Mat4.f32.getElement(i, j);
                    expect(m4[index]).toBe(counter++);
                }
            }
        });
    });

    describe("=> createIdentityMatrix", () =>
    {
        it("| returns expected values", () =>
        {
            const m4 = Mat4.f32.createIdentityMatrix();

            for (let i = 0; i < 4; ++i)
            {
                for (let j = 0; j < 4; ++j)
                {
                    expect(m4[Mat4.f32.getElement(i, j)]).toBe(i === j ? 1 : 0);
                }
            }
        });
    });
});