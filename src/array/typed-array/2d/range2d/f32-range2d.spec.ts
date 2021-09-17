import { debugDescribe, expectValueToBeNearTo } from "../../../../test-utils";
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
            expect(range.isPointInRange(Vec2.f32.factory.createOne(7, 7))).toBe(true);
        });

        it("| returns false if the point is not in the range", () =>
        {
            expect(range.isPointInRange(Vec2.f32.factory.createOne(4, 7))).toBe(false);
            expect(range.isPointInRange(Vec2.f32.factory.createOne(11, 7))).toBe(false);
            expect(range.isPointInRange(Vec2.f32.factory.createOne(7, 4))).toBe(false);
            expect(range.isPointInRange(Vec2.f32.factory.createOne(7, 11))).toBe(false);
        });
    });

    describe("=> doesRangeIntersect", () =>
    {
        const range = Range2d.f32.factory.createOne(5, 10, 5, 10);

        it("| returns true if the ranges overlap", () =>
        {
            expect(range.doesRangeIntersect(Range2d.f32.factory.createOne(6, 7, 6, 7))).toBe(true);
            expect(range.doesRangeIntersect(Range2d.f32.factory.createOne(4, 7, 4, 7))).toBe(true);
            expect(range.doesRangeIntersect(Range2d.f32.factory.createOne(4, 11, 4, 11))).toBe(true);
            expect(range.doesRangeIntersect(Range2d.f32.factory.createOne(7, 11, 7, 11))).toBe(true);
        });

        it("| returns false if the ranges do not overlap", () =>
        {
            expect(range.doesRangeIntersect(Range2d.f32.factory.createOne(1, 4, 6, 7))).toBe(false);
            expect(range.doesRangeIntersect(Range2d.f32.factory.createOne(11, 14, 6, 7))).toBe(false);
            expect(range.doesRangeIntersect(Range2d.f32.factory.createOne(6, 7, 1, 4))).toBe(false);
            expect(range.doesRangeIntersect(Range2d.f32.factory.createOne(6, 7, 11, 14))).toBe(false);
        });
    });

    describe("=> containsRange", () =>
    {
        const range = Range2d.f32.factory.createOne(5, 10, 5, 10);

        it("| returns true if the ranges is contained", () =>
        {
            expect(range.containsRange(Range2d.f32.factory.createOne(6, 7, 6, 7))).toBe(true);
        });

        it("| returns false if the ranges do not overlap", () =>
        {
            expect(range.containsRange(Range2d.f32.factory.createOne(1, 4, 6, 7))).toBe(false);
            expect(range.containsRange(Range2d.f32.factory.createOne(11, 14, 6, 7))).toBe(false);
            expect(range.containsRange(Range2d.f32.factory.createOne(6, 7, 1, 4))).toBe(false);
            expect(range.containsRange(Range2d.f32.factory.createOne(6, 7, 11, 14))).toBe(false);
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

    describe("=> slice", () =>
    {
        it("| creates a copy", () =>
        {
            const a = Range2d.f32.factory.createOne(1, 2, 3, 4);
            const b = a.slice();
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
            expect(a.scaleRelativeTo).toBeDefined();
        });
    });

    describe("=> get2dRangeTransformMatrix", () =>
    {
        const transform = Range2d.f32.factory
            .createOne(-100, -50, 0, 100)
            .getRangeTransform(
                Range2d.f32.factory.createOne(-0.75, -0.5, -1, 1),
            );

        it("| creates the expected matrix", () =>
        {
            // scaling factors
            expectValueToBeNearTo(transform.getValueAt(0, 0), 0.25 / 50);
            expectValueToBeNearTo(transform.getValueAt(1, 1), 2 / 100);
            // transform
            expectValueToBeNearTo(transform.getValueAt(0, 2), -0.25);
            expectValueToBeNearTo(transform.getValueAt(1, 2), -1);
        });

        it("maps vec2s as expected", () =>
        {
            const point = Vec2.f32.factory.createOne(-75, 50);
            const result = point.mat3Multiply(transform);
            expectValueToBeNearTo(result.getX(), -0.625);
            expectValueToBeNearTo(result.getY(), 0);
        });

        it("inverts ranges where ranges are backwards", () =>
        {
            // backwards in that the min is the max and the max is the min
            const backwardsTransform = Range2d.f32.factory
                .createOne(0, 10, 0, 10)
                .getRangeTransform(
                    Range2d.f32.factory.createOne(-10, -5, -10, -5),
                );

            const point = Vec2.f32.factory.createOne(0, 10);
            const result = point.mat3Multiply(backwardsTransform);
            expectValueToBeNearTo(result.getX(), -10);
            expectValueToBeNearTo(result.getY(), -5);
        });
    });

    describe("=> extendRange", () =>
    {
        const range = Range2d.f32.factory.createOne(5, 10, 5, 10);

        it("| extends the range down", () =>
        {
            const extended = range.extendRange(4, 4);
            expect(extended.getXMin()).toBe(4);
            expect(extended.getYMin()).toBe(4);
            expect(extended.getXMax()).toBe(10);
            expect(extended.getYMax()).toBe(10);
        });

        it("| extends the range up", () =>
        {
            const extended = range.extendRange(12, 12);
            expect(extended.getXMin()).toBe(5);
            expect(extended.getYMin()).toBe(5);
            expect(extended.getXMax()).toBe(12);
            expect(extended.getYMax()).toBe(12);
        });
    });

    describe("=> unionRange", () =>
    {
        const range = Range2d.f32.factory.createOne(5, 10, 5, 10);

        it("| extends the range down", () =>
        {
            const extended = range.unionRange(Range2d.f32.factory.createOne(4, 10, 4, 10));
            expect(extended.getXMin()).toBe(4);
            expect(extended.getYMin()).toBe(4);
            expect(extended.getXMax()).toBe(10);
            expect(extended.getYMax()).toBe(10);
        });

        it("| extends the range up", () =>
        {
            const extended = range.unionRange(Range2d.f32.factory.createOne(5, 12, 5, 12));
            expect(extended.getXMin()).toBe(5);
            expect(extended.getYMin()).toBe(5);
            expect(extended.getXMax()).toBe(12);
            expect(extended.getYMax()).toBe(12);
        });
    });

    describe("=> ensureAABB", () =>
    {
        it("| corrects ranges in x", () =>
        {
            const range = Range2d.f32.factory.createOne(1, 0, 0, 1);
            range.ensureAABB();
            expect(range).toEqual(Range2d.f32.factory.createOne(0, 1, 0, 1));
        });

        it("| corrects ranges in y", () =>
        {
            const range = Range2d.f32.factory.createOne(0, 1, 1, 0);
            range.ensureAABB();
            expect(range).toEqual(Range2d.f32.factory.createOne(0, 1, 0, 1));
        });
    });
});
