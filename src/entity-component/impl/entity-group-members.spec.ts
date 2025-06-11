import { EntityGroupMembers } from "./entity-group-members.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { ChartEntity } from "../chart-entity.js";

describe("=> EntityGroupMembers", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("acts as a simple store for entities", () =>
    {
        // it has very basic behavior, just test it all in one...
        const group = new EntityGroupMembers();
        const entity = new ChartEntity();
        expect(group.isMember(entity)).toBe(false);
        expect(group.add(entity)).toBe(true);
        expect(group.add(entity)).toBe(false);
        expect(group.isMember(entity)).toBe(true);
        expect(group.getEntities()).toEqual([entity]);
        expect(group.remove(entity)).toBe(true);
        expect(group.remove(entity)).toBe(false);
        expect(group.getEntities()).toEqual([]);
    });
});