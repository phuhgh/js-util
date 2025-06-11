import { ITemplatedInjectableFactory, TemplatedInjectableFactory } from "./templated-injectables.js";
import { IInjectable, InjectorToken, UnimplementedInjectable, ValueInjectable } from "./injectables.js";
import { DiModule } from "./di-module.js";

describe("=> Templated Injectables", () =>
{
    describe("=> compile checks", () =>
    {
        it("| handles plain templates", () =>
        {
            // i.e. not generic
            // this usage isn't useful in terms of functionality, but it's nice to know it produces the expected result / types
            const dep1 = new UnimplementedInjectable<number>("dep1");
            const dep2 = new UnimplementedInjectable<string>("dep2");

            const templatedFactory = TemplatedInjectableFactory.createOne(
                () => new InjectorToken("test"),
                () => ({
                    dep1: dep1,
                    dep2: dep2,
                }),
                (values) =>
                {
                    return 1 + values.dep1 + values.dep2.length;
                },
                () => null,
            );

            const module = new DiModule();
            const templatedInjectable = templatedFactory({
                dep1: new ValueInjectable(1),
                dep2: new ValueInjectable("test"),
            });

            let value = templatedInjectable.resolveValue(module);
            expect(value).toBe(6);

            // noinspection JSUnusedAssignment - dumb way to check that the type was not `never`...
            value = 42;
        });

        it("| handles generic templates", () =>
        {
            type TTestUnion = string | number;

            // this lets us specialize the resulting injectable, which is why the feature is useful...
            const dep1 = new UnimplementedInjectable<TTestUnion>("dep1");

            interface ITestTemplate<T extends TTestUnion>
            {
                dep1: IInjectable<T>;
            }

            interface IManagedEntity extends ITemplatedInjectableFactory<
                { dep1: IInjectable<TTestUnion> },
                () => null
            >
            {
                <T extends TTestUnion>(template: ITestTemplate<T>): IInjectable<T[]>;
            }

            // generic generics aren't a thing, we need to cast it to the "real" type
            const templatedFactory = TemplatedInjectableFactory.createOne(
                () => new InjectorToken("test"),
                () => ({
                    dep1: dep1,
                }),
                <T extends TTestUnion>(values: { dep1: T }): T[] =>
                {
                    return [values.dep1];
                },
                () => null,
            ) as IManagedEntity;

            const module = new DiModule();
            const templatedNumberInjectable = templatedFactory({
                dep1: new ValueInjectable(1),
            });
            const templatedStringInjectable = templatedFactory(({
                dep1: new ValueInjectable("s" as string),
            }));

            let numberValue = templatedNumberInjectable.resolveValue(module);
            let stringValue = templatedStringInjectable.resolveValue(module);
            expect(numberValue).toEqual([1]);
            expect(stringValue).toEqual(["s"]);

            // noinspection JSUnusedAssignment - dumb way to check that the type was not `never`...
            numberValue = [1];
            // noinspection JSUnusedAssignment - dumb way to check that the type was not `never`...
            stringValue = [""];

            // @ts-expect-error - should only accept numbers
            // noinspection JSUnusedAssignment
            numberValue = ["ss"];
            // @ts-expect-error - should only accept strings
            // noinspection JSUnusedAssignment
            stringValue = [1];
        });
    });
});