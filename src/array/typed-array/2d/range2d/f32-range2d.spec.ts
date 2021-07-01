import { debugDescribe } from "../../../../test-utils";
import { Range2d } from "./range2d";


debugDescribe("=> F32Range2d", () =>
{
    describe("=> isPointInRange", () =>
    {
        const range = Range2d.f32.factory.createOne(5, 10, 5, 10);

        it("| returns true if the point is in the range", () =>
        {
            expect(range.isPointInRange(7, 7)).toBe(true);
        });

        it("| returns false if the point is not in the range", () =>
        {
            expect(range.isPointInRange(4, 7)).toBe(false);
            expect(range.isPointInRange(11, 7)).toBe(false);
            expect(range.isPointInRange(7, 4)).toBe(false);
            expect(range.isPointInRange(7, 11)).toBe(false);
        });
    });
});