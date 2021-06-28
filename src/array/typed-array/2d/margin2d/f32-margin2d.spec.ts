import { Range2d } from "../range2d/range2d";
import { Margin2d } from "./margin2d";
import { debugDescribe } from "../../../../test-utils";

debugDescribe("=> F32Margin2d", () =>
{
    describe("=> getInnerRange", () =>
    {
        it("| produces the expected range", () =>
        {
            const innerRange = Margin2d.f32.getInnerRange(
                Range2d.f32.factory.createOne(50, 100, 50, 100),
                Margin2d.f32.factory.createOne(10, 10, 10, 10),
            );

            expect(Range2d.f32.getXMin(innerRange)).toBe(60);
            expect(Range2d.f32.getXMax(innerRange)).toBe(90);
            expect(Range2d.f32.getYMin(innerRange)).toBe(60);
            expect(Range2d.f32.getYMax(innerRange)).toBe(90);
        });
    });
});