import { debugDescribe } from "../../../../test-utils";
import { Range2d } from "../range2d/range2d";
import { Margin2d } from "./margin2d";

debugDescribe("=> F32Margin2d", () =>
{
    describe("=> getInnerRange", () =>
    {
        it("| produces the expected range", () =>
        {
            const innerRange = Margin2d.f32.factory
                .createOne(10, 10, 10, 10)
                .getInnerRange(
                    Range2d.f32.factory.createOne(50, 100, 50, 100),
                );

            expect(innerRange.getXMin()).toBe(60);
            expect(innerRange.getXMax()).toBe(90);
            expect(innerRange.getYMin()).toBe(60);
            expect(innerRange.getYMax()).toBe(90);
        });
    });
});