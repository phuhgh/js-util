import { TF32Vec3, Vec3 } from "./vec3";
import { setDefaultUnitTestFlags } from "../../../test-utils";

describe("=> Vec3", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    describe("=> getters", () =>
    {
        it("| provides the expected values", () =>
        {
            const v = Vec3.f32.factory.createOne(1, 2, 3);
            expect(v.getX()).toBe(1);
            expect(v.getY()).toBe(2);
            expect(v.getZ()).toBe(3);

        });
    });

    describe("=> setters", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec3.f32.factory.createOneEmpty();
            v.setX(1);
            v.setY(2);
            v.setZ(3);

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(2);
            expect(v[2]).toBe(3);
        });
    });

    describe("=> update", () =>
    {
        it("| sets the expected values", () =>
        {
            const v = Vec3.f32.factory.createOneEmpty();
            v.update(1, 2, 3);

            expect(v[0]).toBe(1);
            expect(v[1]).toBe(2);
            expect(v[2]).toBe(3);
        });
    });

    describe("=> slice", () =>
    {
        it("| creates a copy", () =>
        {
            const a = Vec3.f32.factory.createOne(1, 2, 3);
            const b: TF32Vec3 = a.slice();
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
            expect(a.getX).toBeDefined();
        });
    });
});