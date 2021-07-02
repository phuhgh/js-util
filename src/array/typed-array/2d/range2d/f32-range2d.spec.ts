import { debugDescribe } from "../../../../test-utils";
import { Range2d } from "./range2d";
import { Vec2 } from "../../vec2/vec2";


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
        const range = Range2d.f32.factory.createOne(4, 10, 4, 10);

        it("| retains boundaries when the point is at a boundary (min)", () =>
        {
            const scaledRange = range.scaleRelativeTo(0.5, Vec2.f32.factory.createOne(4,4));
            expect(scaledRange.getXMin()).toBe(4);
            expect(scaledRange.getYMin()).toBe(4);
            expect(scaledRange.getXMax()).toBe(7);
            expect(scaledRange.getYMax()).toBe(7);
        });

        it("| retains boundaries when the point is at a boundary (max)", () =>
        {
            const scaledRange = range.scaleRelativeTo(0.5, Vec2.f32.factory.createOne(10,10));
            expect(scaledRange.getXMin()).toBe(7);
            expect(scaledRange.getYMin()).toBe(7);
            expect(scaledRange.getXMax()).toBe(10);
            expect(scaledRange.getYMax()).toBe(10);
        });

        it("| scales proportionally where away from boundaries", () =>
        {
            const scaledRange = range.scaleRelativeTo(0.5, Vec2.f32.factory.createOne(7,7));
            expect(scaledRange.getXMin()).toBe(5.5);
            expect(scaledRange.getYMin()).toBe(5.5);
            expect(scaledRange.getXMax()).toBe(8.5);
            expect(scaledRange.getYMax()).toBe(8.5);
        });
    });
});