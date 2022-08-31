import { Range2d } from "../range2d/range2d";
import { Margin2d } from "./margin2d";
import { Mat3 } from "../../mat3/mat3";
import { setDefaultUnitTestFlags } from "../../../../test-util/set-default-unit-test-flags";

describe("=> F32Margin2d", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    describe("=> getInnerRange", () =>
    {
        it("| produces the expected range", () =>
        {
            const innerRange = Margin2d.f32.factory
                .createOne(9, 8, 7, 6)
                .getInnerRange(
                    Range2d.f32.factory.createOne(50, 100, 50, 100),
                );

            expect(innerRange.getXMin()).toBe(59);
            expect(innerRange.getXMax()).toBe(92);
            expect(innerRange.getYMin()).toBe(56);
            expect(innerRange.getYMax()).toBe(93);
        });
    });

    describe("=> mat3TransformLength", () =>
    {
        it("| produces the expected range", () =>
        {
            const transform = Mat3.f32.factory
                .createOneEmpty()
                .setScalingMatrix(2, 2);

            const newRange = Margin2d.f32.factory
                .createOne(9, 8, 7, 6)
                .mat3TransformLength(
                    transform,
                );

            expect(newRange.getLeft()).toBe(18);
            expect(newRange.getRight()).toBe(16);
            expect(newRange.getTop()).toBe(14);
            expect(newRange.getBottom()).toBe(12);
        });
    });

    describe("=> slice", () =>
    {
        it("| creates a copy", () =>
        {
            const a = Margin2d.f32.factory.createOne(1, 2, 3, 4);
            const b = a.slice();
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
            expect(a.getInnerRange).toBeDefined();
        });
    });
});