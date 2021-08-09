import { debugDescribe } from "../../../../test-utils";
import { Range1d } from "./range1d";

debugDescribe("=> Range1d", () =>
{
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
});
