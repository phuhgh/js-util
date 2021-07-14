import { debugDescribe } from "../../../../test-utils";
import { Range2d } from "./range2d";
import { Vec2 } from "../../vec2/vec2";
import { Mat3 } from "../../mat3/mat3";

debugDescribe("=> F32Range2d", () =>
{
    describe("=> isPointInRange", () =>
    {
        const range = Range2d.f32.factory.createOne(5, 10, 5, 10);

        it("| returns true if the point is in the range", () =>
        {
            expect(range.isPointInRange((Vec2.f32.factory.createOne(7, 7)))).toBe(true);
        });

        it("| returns false if the point is not in the range", () =>
        {
            expect(range.isPointInRange(Vec2.f32.factory.createOne(4, 7))).toBe(false);
            expect(range.isPointInRange(Vec2.f32.factory.createOne(11, 7))).toBe(false);
            expect(range.isPointInRange(Vec2.f32.factory.createOne(7, 4))).toBe(false);
            expect(range.isPointInRange(Vec2.f32.factory.createOne(7, 11))).toBe(false);
        });
    });

    describe("=> scaleRelativeTo", () =>
    {
        describe("=> zooming out", () =>
        {
            const range = Range2d.f32.factory.createOne(4, 10, 4, 10);

            it("| retains boundaries when the point is at a boundary (min)", () =>
            {
                const scaledRange = range.scaleRelativeTo(0.5, Vec2.f32.factory.createOne(4, 4));
                expect(scaledRange.getXMin()).toBe(4);
                expect(scaledRange.getYMin()).toBe(4);
                expect(scaledRange.getXMax()).toBe(7);
                expect(scaledRange.getYMax()).toBe(7);
            });

            it("| retains boundaries when the point is at a boundary (max)", () =>
            {
                const scaledRange = range.scaleRelativeTo(0.5, Vec2.f32.factory.createOne(10, 10));
                expect(scaledRange.getXMin()).toBe(7);
                expect(scaledRange.getYMin()).toBe(7);
                expect(scaledRange.getXMax()).toBe(10);
                expect(scaledRange.getYMax()).toBe(10);
            });

            it("| scales proportionally where away from boundaries", () =>
            {
                const scaledRange = range.scaleRelativeTo(0.5, Vec2.f32.factory.createOne(7, 7));
                expect(scaledRange.getXMin()).toBe(5.5);
                expect(scaledRange.getYMin()).toBe(5.5);
                expect(scaledRange.getXMax()).toBe(8.5);
                expect(scaledRange.getYMax()).toBe(8.5);
            });
        });

        describe("=> zooming in", () =>
        {
            const range = Range2d.f32.factory.createOne(4, 10, 4, 10);

            it("| retains boundaries when the point is at a boundary (min)", () =>
            {
                const scaledRange = range.scaleRelativeTo(2, Vec2.f32.factory.createOne(4, 4));
                expect(scaledRange.getXMin()).toBe(4);
                expect(scaledRange.getYMin()).toBe(4);
                expect(scaledRange.getXMax()).toBe(16);
                expect(scaledRange.getYMax()).toBe(16);
            });

            it("| retains boundaries when the point is at a boundary (max)", () =>
            {
                const scaledRange = range.scaleRelativeTo(2, Vec2.f32.factory.createOne(10, 10));
                expect(scaledRange.getXMin()).toBe(-2);
                expect(scaledRange.getYMin()).toBe(-2);
                expect(scaledRange.getXMax()).toBe(10);
                expect(scaledRange.getYMax()).toBe(10);
            });

            it("| scales proportionally where away from boundaries", () =>
            {
                const scaledRange = range.scaleRelativeTo(2, Vec2.f32.factory.createOne(7, 7));
                expect(scaledRange.getXMin()).toBe(1);
                expect(scaledRange.getYMin()).toBe(1);
                expect(scaledRange.getXMax()).toBe(13);
                expect(scaledRange.getYMax()).toBe(13);
            });
        });
    });

    describe("=> bound", () =>
    {
        it("| bounds ranges that are too large", () =>
        {
            const range = Range2d.f32.factory.createOne(0, 10, 0, 10);
            range.bound(Range2d.f32.factory.createOne(2, 8, 2, 8));
            expect(range.getXMin()).toBe(2);
            expect(range.getYMin()).toBe(2);
            expect(range.getXMax()).toBe(8);
            expect(range.getYMax()).toBe(8);
        });

        it("| translates ranges that are out of bounds (neg)", () =>
        {
            const range = Range2d.f32.factory.createOne(0, 10, 0, 10);
            range.bound(Range2d.f32.factory.createOne(-20, -5, -20, -5));
            expect(range.getXMin()).toBe(-15);
            expect(range.getYMin()).toBe(-15);
            expect(range.getXMax()).toBe(-5);
            expect(range.getYMax()).toBe(-5);
        });

        it("| translates ranges that are out of bounds (pos)", () =>
        {
            const range = Range2d.f32.factory.createOne(0, 10, 0, 10);
            range.bound(Range2d.f32.factory.createOne(15, 30, 15, 30));
            expect(range.getXMin()).toBe(15);
            expect(range.getYMin()).toBe(15);
            expect(range.getXMax()).toBe(25);
            expect(range.getYMax()).toBe(25);
        });
    });

    describe("=> mat3Multiply", () =>
    {
        it("| moves the range as expected", () =>
        {
            const range = Range2d.f32.factory.createOne(0, 10, 0, 10);
            const tm = Mat3.f32.factory
                .createOneEmpty()
                .setTranslationMatrix(3, 4);
            range.mat3Multiply(tm, range);

            expect(range.getXMin()).toBe(3);
            expect(range.getXMax()).toBe(13);
            expect(range.getYMin()).toBe(4);
            expect(range.getYMax()).toBe(14);
        });
    });
});
