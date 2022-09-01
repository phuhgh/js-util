import { expectValueToBeNearTo } from "../../../../test-util/test-utils.js";
import { Range1d } from "./range1d.js";
import { Mat2 } from "../../mat2/mat2.js";
import { setDefaultUnitTestFlags } from "../../../../test-util/set-default-unit-test-flags.js";

describe("=> Range1d", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    describe("=> isPointInRange", () =>
    {
        const range = Range1d.f32.factory.createOne(5, 10);

        it("| returns true if the point is in the range", () =>
        {
            expect(range.isValueInRange1d(7)).toBe(true);
        });

        it("| returns false if the point is not in the range", () =>
        {
            expect(range.isValueInRange1d(4)).toBe(false);
            expect(range.isValueInRange1d(11)).toBe(false);
        });
    });

    describe("=> scaleRelativeTo", () =>
    {
        describe("=> zooming out", () =>
        {
            const range = Range1d.f32.factory.createOne(4, 10);

            it("| retains boundaries when the point is at a boundary (min)", () =>
            {
                const scaledRange = range.scaleRelativeTo(0.5, 4);
                expect(scaledRange.getMin()).toBe(4);
                expect(scaledRange.getMax()).toBe(7);
            });

            it("| retains boundaries when the point is at a boundary (max)", () =>
            {
                const scaledRange = range.scaleRelativeTo(0.5, 10);
                expect(scaledRange.getMin()).toBe(7);
                expect(scaledRange.getMax()).toBe(10);
            });

            it("| scales proportionally where away from boundaries", () =>
            {
                const scaledRange = range.scaleRelativeTo(0.5, 7);
                expect(scaledRange.getMin()).toBe(5.5);
                expect(scaledRange.getMax()).toBe(8.5);
            });
        });

        describe("=> zooming in", () =>
        {
            const range = Range1d.f32.factory.createOne(4, 10);

            it("| retains boundaries when the point is at a boundary (min)", () =>
            {
                const scaledRange = range.scaleRelativeTo(2, 4);
                expect(scaledRange.getMin()).toBe(4);
                expect(scaledRange.getMax()).toBe(16);
            });

            it("| retains boundaries when the point is at a boundary (max)", () =>
            {
                const scaledRange = range.scaleRelativeTo(2, 10);
                expect(scaledRange.getMin()).toBe(-2);
                expect(scaledRange.getMax()).toBe(10);
            });

            it("| scales proportionally where away from boundaries", () =>
            {
                const scaledRange = range.scaleRelativeTo(2, 7);
                expect(scaledRange.getMin()).toBe(1);
                expect(scaledRange.getMax()).toBe(13);
            });
        });
    });

    describe("=> bound", () =>
    {
        it("| bounds ranges that are too large", () =>
        {
            const range = Range1d.f32.factory.createOne(0, 10);
            range.bound1d(Range1d.f32.factory.createOne(2, 8));
            expect(range.getMin()).toBe(2);
            expect(range.getMax()).toBe(8);
        });

        it("| translates ranges that are out of bounds (neg)", () =>
        {
            const range = Range1d.f32.factory.createOne(0, 10);
            range.bound1d(Range1d.f32.factory.createOne(-20, -5));
            expect(range.getMin()).toBe(-15);
            expect(range.getMax()).toBe(-5);
        });

        it("| translates ranges that are out of bounds (pos)", () =>
        {
            const range = Range1d.f32.factory.createOne(0, 10);
            range.bound1d(Range1d.f32.factory.createOne(15, 30));
            expect(range.getMin()).toBe(15);
            expect(range.getMax()).toBe(25);
        });
    });

    describe("=> mat2Multiply", () =>
    {
        it("| moves the range as expected", () =>
        {
            const range = Range1d.f32.factory.createOne(0, 10);
            const tm = Mat2.f32.factory
                .createOneEmpty()
                .setTranslationMatrix(3);
            range.mat2Multiply(tm, range);

            expect(range.getMin()).toBe(3);
            expect(range.getMax()).toBe(13);
        });
    });

    describe("=> slice", () =>
    {
        it("| creates a copy", () =>
        {
            const a = Range1d.f32.factory.createOne(1, 2);
            const b = a.slice();
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
            expect(a.bound1d).toBeDefined();
        });
    });

    describe("=> get2dRangeTransformMatrix", () =>
    {
        const transform = Range1d.f32.factory
            .createOne(-100, -50)
            .getRangeTransform(
                Range1d.f32.factory.createOne(-0.75, -0.5),
            );

        it("| creates the expected matrix", () =>
        {
            // scaling factors
            expectValueToBeNearTo(transform.getValueAt(0, 0), 0.25 / 50);
            // transform
            expectValueToBeNearTo(transform.getValueAt(0, 1), -0.25);
        });

        it("maps values as expected", () =>
        {
            expectValueToBeNearTo(transform.getVec2MultiplyX(-75), -0.625);
            expectValueToBeNearTo(transform.getVec2MultiplyX(50), 0);
        });

        it("inverts ranges where ranges are backwards", () =>
        {
            // backwards in that the min is the max and the max is the min
            const backwardsTransform = Range1d.f32.factory
                .createOne(0, 10)
                .getRangeTransform(
                    Range1d.f32.factory.createOne(-10, -5),
                );

            expectValueToBeNearTo(backwardsTransform.getVec2MultiplyX(0), -10);
            expectValueToBeNearTo(backwardsTransform.getVec2MultiplyX(10), -5);
        });
    });

    describe("=> extendRange", () =>
    {
        const range = Range1d.f32.factory.createOne(5, 10);

        it("| extends the range down", () =>
        {
            const extended = range.extendRange(4);
            expect(extended.getMin()).toBe(4);
            expect(extended.getMax()).toBe(10);
        });

        it("| extends the range up", () =>
        {
            const extended = range.extendRange(12);
            expect(extended.getMin()).toBe(5);
            expect(extended.getMax()).toBe(12);
        });
    });

    describe("=> unionRange", () =>
    {
        const range = Range1d.f32.factory.createOne(5, 10);

        it("| extends the range down", () =>
        {
            const extended = range.unionRange(Range1d.f32.factory.createOne(4, 10));
            expect(extended.getMin()).toBe(4);
            expect(extended.getMax()).toBe(10);
        });

        it("| extends the range up", () =>
        {
            const extended = range.unionRange(Range1d.f32.factory.createOne(5, 12));
            expect(extended.getMin()).toBe(5);
            expect(extended.getMax()).toBe(12);
        });
    });
});
