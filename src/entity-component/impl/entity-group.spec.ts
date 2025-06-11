import { EntityGroup, ManagedEntity } from "./entity-group.js";
import { NoOpOnGroupChange } from "./no-op-on-group-change.js";
import { IOnGroupChange } from "../entity-group-core-model.js";
import { EntityGroupMembers } from "./entity-group-members.js";
import { SanitizedEmscriptenTestModule } from "../../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";
import utilTestModule from "../../external/test-module.mjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { ChartEntity } from "../chart-entity.js";
import { onEntityAddedToGroup } from "../events/on-entity-added-to-group.js";
import { onEntityRemovedFromGroup } from "../events/on-entity-removed-from-group.js";
import { blockScope } from "../../lifecycle/block-scoped-lifecycle.js";
import { _Fp } from "../../fp/_fp.js";
import { IJsUtilBindings } from "../../web-assembly/i-js-util-bindings.js";
import type { ITestOnlyBindings } from "../../web-assembly/i-test-only-bindings.js";

describe("=> EntityGroup", () =>
{
    const testModule = new SanitizedEmscriptenTestModule<IJsUtilBindings, ITestOnlyBindings>(utilTestModule, getTestModuleOptions());

    beforeEach(async () =>
    {
        Test_setDefaultFlags();
        await testModule.initialize();
    });

    describe("=> addEntity", () =>
    {
        it("| returns the expected values", () =>
        {
            const groupHooks: IOnGroupChange<{}, object> = new NoOpOnGroupChange();
            const group = new EntityGroup({}, groupHooks, new EntityGroupMembers());

            const entity = new ChartEntity();
            expect(group.addEntity(entity, {})).toBe(true);
            expect(group.addEntity(entity, {})).toBe(false);
        });

        it("| calls hooks if the entity was added", () =>
        {
            const groupHooks: IOnGroupChange<{}, object> = new NoOpOnGroupChange();
            const group = new EntityGroup({}, groupHooks, new EntityGroupMembers());

            let emittedEntity: object | undefined = undefined;
            const groupSpy = spyOn(groupHooks, "onEntityAdded");
            const entity = new ChartEntity();
            group.eventService.getCategory(onEntityAddedToGroup).addOneTimeListener({ onEntityAddedToGroup: (entity) => emittedEntity = entity });

            // check the hooks are called only the once
            group.addEntity(entity, {});
            expect(emittedEntity).toBe(entity as any);
            emittedEntity = undefined;
            group.addEntity(entity, {});
            expect(emittedEntity).toBe(undefined);

            expect(groupSpy).toHaveBeenCalledOnceWith(entity, {});
        });
    });

    describe("=> removeEntity", () =>
    {
        it("| returns true if the entity was removed from the group", () =>
        {
            const groupHooks: IOnGroupChange<{}, object> = new NoOpOnGroupChange();
            const group = new EntityGroup({}, groupHooks, new EntityGroupMembers());

            const entity = new ChartEntity();
            expect(group.removeEntity(entity)).toBe(false);
            group.addEntity(entity, {});
            expect(group.removeEntity(entity)).toBe(true);
        });

        it("| calls hooks if the entity was removed", () =>
        {
            const groupHooks: IOnGroupChange<{}, object> = new NoOpOnGroupChange();
            const group = new EntityGroup({}, groupHooks, new EntityGroupMembers());

            const groupSpy = spyOn(groupHooks, "onEntityRemoved");
            const entity = new ChartEntity();
            let emittedEntity: object | undefined = undefined;
            group.eventService.getCategory(onEntityRemovedFromGroup).addOneTimeListener({ onEntityRemovedFromGroup: (entity) => emittedEntity = entity });


            group.addEntity(entity, {});
            group.removeEntity(entity);
            expect(emittedEntity).toBe(entity as any);
            emittedEntity = undefined;
            group.removeEntity(entity);
            expect(emittedEntity).toBe(undefined);

            expect(groupSpy).toHaveBeenCalledOnceWith(entity);
        });
    });

    describe("=> EntityGroup", () =>
    {
        it("| keeps linked ManagedEntity's alive", _Fp.runWithin([blockScope], () =>
        {
            let entity!: ManagedEntity;
            const group = new EntityGroup({}, new NoOpOnGroupChange(), new EntityGroupMembers(), testModule.wrapper, testModule.wrapper.rootNode);

            blockScope(() =>
            {
                entity = new ManagedEntity(testModule.wrapper, null);
                expect(group.resourceHandle.getLinked().getLinkedNodes().length).toBe(0);
                group.addEntity(entity, {});
                expect(group.resourceHandle.getLinked().getLinkedNodes().length).toBe(1);
            });

            expect(entity.resourceHandle.getIsDestroyed()).toBe(false);


            testModule.wrapper.rootNode.getLinked().unlinkAll();
            expect(entity.resourceHandle.getIsDestroyed()).toBe(true);
        }));
    });
});
