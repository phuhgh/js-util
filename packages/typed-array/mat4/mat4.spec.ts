import { Mat4, TF32Mat4 } from "./mat4";
import { Vec4 } from "../vec4/vec4";

describe("=> Mat4", () =>
{
    describe("=> getValueAt", () =>
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

    describe("=> setValueAt", () =>
    {
        it("| sets the expected element", () =>
        {
            const m4 = Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            m4.setValueAt(0, 3, 99);
            expect(m4[12]).toBe(99);
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

            // @ts-expect-error - a tuple of incorrect length should be a compile error where offset not supplied
            m4.set([1, 2, 3, 4]);
        });
    });

    describe("=> slice", () =>
    {
        it("| creates a copy", () =>
        {
            const a = Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b: TF32Mat4 = a.slice();
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
            expect(a.setIdentityMatrix).toBeDefined();
        });
    });

    describe("=> getRow", () =>
    {
        it("| returns rows as vec4", () =>
        {
            const a = Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            expect(a.getRow(3)).toEqual(Vec4.f32.factory.createOne(13, 14, 15, 16));
        });
    });

    describe("=> setRow", () =>
    {
        it("| modifies the array as expected", () =>
        {
            const a = Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            a.setRow(3, Vec4.f32.factory.createOne(1, 2, 3, 4));
            expect(a).toEqual(Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4));
        });
    });

    describe("=> isEqualTo", () =>
    {
        it("| returns true if all components are the same", () =>
        {
            const a = Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b = Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

            expect(a.isEqualTo(b)).toBe(true);
        });

        it("| returns false if any component is different", () =>
        {
            const a1 = Mat4.f32.factory.createOne(0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            const b1 = Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            expect(a1.isEqualTo(b1)).toBe(false);

            const a2 = Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0);
            const b2 = Mat4.f32.factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            expect(a2.isEqualTo(b2)).toBe(false);
        });
    });
});