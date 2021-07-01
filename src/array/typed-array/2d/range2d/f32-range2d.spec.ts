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
});