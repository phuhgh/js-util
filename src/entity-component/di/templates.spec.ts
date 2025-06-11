import { EntityGroupLinkTemplate, TemplateInjectable } from "./templates.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { EntityGroup, type TSubsetEntityGroup } from "../impl/entity-group.js";


describe("=> templates", () =>
{

    // todo jack14: shared memory ownership!

    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });



    describe("=> EntityGroupLinkTemplate", () =>
    {
        it("| constrains the type relations as expected", () =>
        {
            interface A
            {
                a: 1;
            }

            interface B extends A
            {
                b: 1;
            }

            // todo jack: this has a problem with type widening on the array side, it's not fixable without using builder pattern (which might be to onerous to use...)
            const a = TemplateInjectable.fromValue("", new EntityGroup({}) as TSubsetEntityGroup<object, unknown, A>, undefined);
            const b = TemplateInjectable.fromValue("", new EntityGroup({}) as TSubsetEntityGroup<object, unknown, B>, undefined);
            const c = TemplateInjectable.fromValue("", new EntityGroup({}) as TSubsetEntityGroup<A, unknown, object>, undefined);
            const d = TemplateInjectable.fromValue("", new EntityGroup({}) as TSubsetEntityGroup<B, unknown, object>, undefined);
            EntityGroupLinkTemplate.createOne("", b, [a]);
            // @ts-expect-error - trait not met
            EntityGroupLinkTemplate.createOne("", a, [b]);

            EntityGroupLinkTemplate.createOne("", d, [c]);
            // @ts-expect-error - options not met
            EntityGroupLinkTemplate.createOne("", c, [d]);
        });
    });

    // todo jack: need to add specific tests for the superset stuff, that it doesn't compile where expected
    // it("| doesn't compile where todo jack", () =>
    // {
    //     const glChart = new TemplateInjectable(
    //         "chart_id",
    //         (_, options) => GL_CHART_FACTORY({
    //             config: new ValueInjectable({
    //                 contextAdapterCtor: Gl2ContextAdapter,
    //                 rendererConfig: new GlRendererConfig(["EXT_frag_depth"] as const, { preserveDrawingBuffer: true }),
    //             }),
    //             chartOptions: new ValueInjectable(options),
    //         }),
    //         new ChartComponentOptions(),
    //     );
    //
    //     const gc: IGraphicsComponent<TGl2ComponentRenderer<"ANGLE_instanced_arrays">, unknown, object> = new TestGlComp();
    //     const gc2: IGraphicsComponent<TGl2ComponentRenderer<"EXT_frag_depth">, unknown, object> = new TestGlComp();
    //     const testEntity = new ChartEntity();
    //
    //     // todo jack16: q, when one of the options changes, what should happen? E.g. you change graphics component
    //     // ideally it handles the change, at the moment we can't even know something changed...
    //     DeclarativeChartComponent({
    //         chart: glChart,
    //         updateGroup: {
    //             entityMembers: [
    //                 {
    //                     create: SupersetGroupEntities.createOne(
    //                         () => ({
    //                             graphicsComponent: gc,
    //                         }),
    //                         // @ts-expect-error - the gc requires an extension that is not present
    //                         UpdateGroupAttributes.validateOptions,
    //                         [
    //                             testEntity,
    //                         ],
    //                     ),
    //                 },
    //                 {
    //                     create: SupersetGroupEntities.createOne(
    //                         () => ({
    //                             graphicsComponent: gc2,
    //                         }),
    //                         UpdateGroupAttributes.validateOptions,
    //                         [
    //                             testEntity,
    //                         ],
    //                     ),
    //                 },
    //             ],
    //         },
    //         plots: [],
    //     });
    // });

    // it("| allows declarative specification", () =>
    // {
    //     const templateContext = new TemplateContext();
    //     const glChart = new TemplateInjectable(
    //         "chart_id",
    //         (_, options) => GL_CHART_FACTORY({
    //             config: new ValueInjectable({
    //                 contextAdapterCtor: Gl2ContextAdapter,
    //                 rendererConfig: new GlRendererConfig(["EXT_frag_depth"] as const, { preserveDrawingBuffer: true }),
    //             }),
    //             chartOptions: new ValueInjectable(options),
    //         }),
    //         new ChartComponentOptions(),
    //     );
    //     const plot1 = TemplateInjectable.createDynamic(
    //         new InjectorToken("plot1"),
    //         // todo jack: the typing on this is not correct where deps is empty
    //         [] as const,
    //         (options) => PLOT_FACTORY.createOne({
    //             updateStrategy: new TestUpdateStrategy(),
    //             config: getTestGlPlotConfig(options),
    //         }),
    //         getTestGlPlotOptions(),
    //     );
    //
    //     // testing that it can be done, not necessarily a good idea
    //     const updateGroup = TemplateInjectable.createStatic(new InjectorToken("chart_update_group_id"), [glChart] as const, (chart) =>
    //     {
    //         return chart.renderer.updateGroup;
    //     });
    //
    //     interface AxisTrait
    //     {
    //     }
    //
    //     const axisGroup1 = TemplateInjectable.createStatic(
    //         new InjectorToken("axis_group_id"),
    //         [glChart, updateGroup] as const,
    //         (chart, updateGroup) =>
    //         {
    //             return new EntityGroup<object, object, AxisTrait>({ sillyExample: chart.changeIdFactory, likeVeryBadIdea: updateGroup });
    //         },
    //     );
    //
    //     const gc: IGraphicsComponent<TGl2ComponentRenderer<"EXT_frag_depth">, unknown, object> = new TestGlComp();
    //     // todo jack15: make declarative - specifically things like being able to inject plot into a click handler to support e.g. adding / removing entities
    //     const testEntity = new ChartEntity();
    //
    //     DeclarativeChartComponent({
    //         chart: glChart,
    //         updateGroup: {
    //             entityMembers: [
    //                 {
    //                     create: SupersetGroupEntities.withTemplate(
    //                         templateContext,
    //                         [plot1] as const,
    //                         (plot) => ({
    //                             graphicsComponent: gc,
    //                             bufferPerEntity: plot.plotName === "this is a very stupid example",
    //                         }),
    //                         UpdateGroupAttributes.validateOptions,
    //                         [
    //                             testEntity,
    //                         ],
    //                     ),
    //                 },
    //             ],
    //         },
    //         plots: [
    //             {
    //                 plot: plot1,
    //                 groups: [{ group: axisGroup1, entityMembers: [] }],
    //             },
    //         ],
    //         groupRelations: [
    //             EntityGroupLinkTemplate.createOne("not sure", updateGroup, [axisGroup1]),
    //         ],
    //     });
    // });
});

// class TestGlComp
//     extends GlNoOpGraphicsComponent
//     implements ILinkableGraphicsComponent<TGl2ComponentRenderer<"EXT_sRGB">, unknown, unknown>
// {
//     public getLinkableBinders(): ILinkableDataBinder<TGl2ComponentRenderer<"EXT_sRGB">>[]
//     {
//         return [];
//     }
// }