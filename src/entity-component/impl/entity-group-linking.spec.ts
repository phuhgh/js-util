import { EntityGroup, TLinkableGroup } from "./entity-group.js";
import { LinkingKeyFactory } from "../i-linked-entity-groups.js";

describe("=> EntityGroup linking", () =>
{
    describe("=> compile checks", () =>
    {
        let a: TLinkableGroup<ITestOptionsA, ITestAttributesA, ITraitA>;
        let b: TLinkableGroup<ITestOptionsB, ITestAttributesB, ITraitB>;

        beforeEach(() =>
        {
            a = new EntityGroup<ITestOptionsA, ITestAttributesA, ITraitA>({ a: "" } as ITestAttributesA);
            b = new EntityGroup<ITestOptionsB, ITestAttributesB, ITraitB>({ a: "", b: "" } as ITestAttributesB);
        });

        describe("=> linkFromGroup", () =>
        {
            // i.e. listen to events from
            it("| prevents linking if FromOptions is not a super type of ToOptions", () =>
            {
                // @ts-expect-error a doesn't meet b
                b.linkedGroups.linkFromGroup(a);
            });

            it("| allows linking if options are structurally compatible", () =>
            {
                a.linkedGroups.linkFromGroup(b);
            });

            it("| prevents linking if the linking key attributes are not met", () =>
            {
                // @ts-expect-error a doesn't meet the link key
                a.linkedGroups.linkFromGroup(a, testLinkKeyAttributesB);
            });

            it("| allows linking if the linking key attributes are structurally compatible (attributes)", () =>
            {
                a.linkedGroups.linkFromGroup(a, testLinkKeyAttributesA);
            });

            it("| prevents linking if the linking key trait is not met", () =>
            {
                // @ts-expect-error a doesn't meet the link key
                a.linkedGroups.linkFromGroup(a, testLinkKeyTraitB);
            });

            it("| allows linking if the linking key attributes are structurally compatible (trait)", () =>
            {
                a.linkedGroups.linkFromGroup(a, testLinkKeyTraitA);
            });
        });

        describe("=> linkToGroup", () =>
        {
            // i.e. broadcast events to

            it("| prevents linking if FromOptions is not a super type of ToOptions", () =>
            {
                // @ts-expect-error a doesn't meet b
                a.linkedGroups.linkToGroup(b);
            });

            it("| allows linking if options are structurally compatible", () =>
            {
                b.linkedGroups.linkToGroup(a);
            });

            it("| prevents linking if the linking key attributes is not met", () =>
            {
                // @ts-expect-error a doesn't meet the link key
                a.linkedGroups.linkToGroup(a, testLinkKeyAttributesB);
            });

            it("| allows linking if the linking key attributes are structurally compatible (attributes)", () =>
            {
                a.linkedGroups.linkToGroup(a, testLinkKeyAttributesA);
            });

            it("| prevents linking if the linking key trait is not met", () =>
            {
                // @ts-expect-error a doesn't meet the link key
                a.linkedGroups.linkToGroup(a, testLinkKeyTraitB);
            });

            it("| allows linking if the linking key attributes are structurally compatible (trait)", () =>
            {
                a.linkedGroups.linkToGroup(a, testLinkKeyTraitA);
            });
        });
    });
});

interface ITraitA
{
    a: number;
}

interface ITraitB extends ITraitA
{
    b: number;
}

interface ITestOptionsA
{
    a: number;
}

interface ITestOptionsB extends ITestOptionsA
{
    b: number;
}

interface ITestAttributesA
{
    a: string;
}

interface ITestAttributesB extends ITestAttributesA
{
    b: string;
}

const testLinkKeyAttributesA = LinkingKeyFactory.createOne<ITestAttributesA, any>("test link key attributes A");
const testLinkKeyAttributesB = LinkingKeyFactory.createOne<ITestAttributesB, any>("test link key attributes B");

const testLinkKeyTraitA = LinkingKeyFactory.createOne<any, ITraitA>("test link key trait A");
const testLinkKeyTraitB = LinkingKeyFactory.createOne<any, ITraitB>("test link key trait B");