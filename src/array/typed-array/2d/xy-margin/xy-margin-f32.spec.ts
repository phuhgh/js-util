import { XyRange } from "../xy-range/xy-range";
import { XyMargin } from "./xy-margin";
import { debugDescribe } from "../../../../test-utils";

debugDescribe("=> XyMarginF32", () =>
{
    describe("=> getInnerRange", () =>
    {
        it("| produces the expected range", () =>
        {
            const innerRange = XyMargin.f32.getInnerRange(
                XyRange.f32.factory.createOne(50, 100, 50, 100),
                XyMargin.f32.factory.createOne(10, 10, 10, 10),
            );

            expect(XyRange.f32.getXMin(innerRange)).toBe(60);
            expect(XyRange.f32.getXMax(innerRange)).toBe(90);
            expect(XyRange.f32.getYMin(innerRange)).toBe(60);
            expect(XyRange.f32.getYMax(innerRange)).toBe(90);
        });
    });
});