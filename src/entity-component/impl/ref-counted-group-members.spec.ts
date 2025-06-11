import { RefCountedGroupMembers } from "./ref-counted-group-members.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { ChartEntity } from "../chart-entity.js";
import { arrayEmptyArray } from "../../array/impl/array-empty-array.js";

describe("=> RefCountedGroupMembers", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    describe("=> addEntity", () =>
    {
        it("| adds to the group if not already present", () =>
        {
            const members = new RefCountedGroupMembers();
            const entity = new ChartEntity();
            members.add(entity);
            expect(members.isMember(entity)).toBe(true);
        });

        it("| has the same entity count if entity is added twice", () =>
        {
            const members = new RefCountedGroupMembers();
            const entity = new ChartEntity();
            members.add(entity);
            members.add(entity);
            expect(members.getEntities()).toEqual([entity]);
        });
    });

    describe("=> remove entity", () =>
    {
        it("| removes by ref count", () =>
        {
            const cleanup = jasmine.createSpy();
            const members = new RefCountedGroupMembers(cleanup);
            const entity = new ChartEntity();
            members.add(entity);
            members.add(entity);
            members.remove(entity);
            expect(members.isMember(entity)).toBe(true);
            members.remove(entity);
            expect(members.isMember(entity)).toBe(false);
            expect(cleanup).toHaveBeenCalledWith(entity);
        });

        it("| does nothing if no entities", () =>
        {
            const cleanup = jasmine.createSpy();
            const members = new RefCountedGroupMembers(cleanup);
            const entity = new ChartEntity();
            members.remove(entity);
            expect(members.isMember(entity)).toBe(false);
            expect(members.getEntities()).toEqual([]);
            expect(cleanup).not.toHaveBeenCalled();
        });
    });

    describe("=> get entities", () =>
    {
        it("| returns empty array if plot not populated", () =>
        {
            const members = new RefCountedGroupMembers();
            expect(members.getEntities()).toEqual(arrayEmptyArray);
        });

        it("| returns entities", () =>
        {
            const members = new RefCountedGroupMembers();
            const entity = new ChartEntity();
            members.add(entity);
            expect(members.getEntities()).toEqual([entity]);
        });
    });
});