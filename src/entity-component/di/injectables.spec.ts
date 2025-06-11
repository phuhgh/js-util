import { IInjectable, Injectable, InjectorToken, InlineInjectable, TUnwrapDependencies, UnimplementedInjectable } from "./injectables.js";
import { DiModule } from "./di-module.js";
import { InjectableError } from "./injectable-error.js";
import { _Production } from "../../production/_production.js";

describe("=> Injectables", () =>
{
    const tokenA = new InjectorToken("A");
    const token1 = new InjectorToken("B");
    const injectable1 = new Injectable(token1, [], () => 1 as const);
    const token2 = new InjectorToken("2");
    const injectable2 = new Injectable(token2, [], () => 2 as const);

    describe("=> compile checks", () =>
    {
        it("| Injectable creates the correct types", () =>
        {
            const injectable = new Injectable(tokenA, [injectable1, injectable2] as const, (a, b) =>
            {
                // noinspection SuspiciousTypeOfGuard - assert that the value is not "any"
                if (typeof a !== "number")
                {
                    _Production.assertValueIsNever(a);
                }
                // noinspection SuspiciousTypeOfGuard - assert that the value is not "any"
                if (typeof b !== "number")
                {
                    _Production.assertValueIsNever(b);
                }
                // we know it's not any, ensure they're the expected literals
                const aVal: 1 = a;
                const bVal: 2 = b;
                expect(a).toBe(1);
                expect(b).toBe(2);

                return aVal + bVal;
            });

            let deps: readonly [Injectable<1, never[]>, Injectable<2, never[]>] = injectable.dependencies;

            // this expect is just to appease lint etc., the type assert is the important part
            expect(deps).toBeDefined();
        });

        it("| TUnwrapDependencies creates the expected types", () =>
        {
            // split declaration to catch out never
            let a: TUnwrapDependencies<[IInjectable<1>]>;
            a = [1];
            let b: TUnwrapDependencies<[IInjectable<1>, IInjectable<2>]>;
            b = [1, 2];
            let c: TUnwrapDependencies<[IInjectable<1>, IInjectable<2>, IInjectable<3>]>;
            c = [1, 2, 3];
            let d: TUnwrapDependencies<[IInjectable<1>, IInjectable<2>, IInjectable<3>, IInjectable<4>]>;
            d = [1, 2, 3, 4];
            let e: TUnwrapDependencies<[IInjectable<1>, IInjectable<2>, IInjectable<3>, IInjectable<4>, IInjectable<5>]>;
            e = [1, 2, 3, 4, 5];
            let f: TUnwrapDependencies<[IInjectable<1>, IInjectable<2>, IInjectable<3>, IInjectable<4>, IInjectable<5>, IInjectable<6>]>;
            f = [1, 2, 3, 4, 5, 6];
            let g: TUnwrapDependencies<[IInjectable<1>, IInjectable<2>, IInjectable<3>, IInjectable<4>, IInjectable<5>, IInjectable<6>, IInjectable<7>]>;
            g = [1, 2, 3, 4, 5, 6, 7];
            let h: TUnwrapDependencies<[IInjectable<1>, IInjectable<2>, IInjectable<3>, IInjectable<4>, IInjectable<5>, IInjectable<6>, IInjectable<7>, IInjectable<8>]>;
            h = [1, 2, 3, 4, 5, 6, 7, 8];


            // this expect is just to appease lint etc., the type assert is the important part
            expect([a, b, c, d, e, f, g, h]).toBeDefined();
        });
    });

    describe("=> Injectable", () =>
    {
        it("| creates injectables that do not exist, reuses if already created", () =>
        {
            const d = new InlineInjectable("a", [], () => ({ a: true }) as const);
            const module = new DiModule();
            const v = d.resolveValue(module);
            expect(v).toBe(d.resolveValue(module));
            expect(v).toEqual({ a: true });
        });

        it("| creates dependencies that have not yet been created, reuses those already created", () =>
        {
            let aCreateCount = 0;
            let bCreateCount = 0;
            const injB = new InlineInjectable("a", [], () =>
            {
                bCreateCount++;
                return { b: true } as const;
            });
            const injA = new InlineInjectable("b", [injB], (b: { readonly b: true }) =>
            {
                aCreateCount++;
                return { a: true, ...b } as const;
            });
            const injT1 = new InlineInjectable("t1", [injA], (a: { readonly a: true, readonly b: true }) =>
            {
                return { t1: true, ...a } as const;
            });
            const injT2 = new InlineInjectable("t2", [injA, injB], (a: { readonly a: true, readonly b: true }, b: { readonly b: true }) =>
            {
                return ({ t2: true, ...b, ...a }) as const;
            });

            const module = new DiModule();
            expect(injT1.resolveValue(module)).toEqual({ t1: true, a: true, b: true } as const);
            expect(injT2.resolveValue(module)).toEqual({ t2: true, a: true, b: true } as const);
            expect(aCreateCount).toBe(1);
            expect(bCreateCount).toBe(1);
        });

        it("| provides diagnostic messages where a module is not implemented", () =>
        {
            const inner = new UnimplementedInjectable<number>("INNER_DEP");
            const module = new DiModule();

            let thrownError: InjectableError | null = null as any;
            expect(() => inner.resolveValue(module)).toThrowMatching((error) =>
            {
                if (!(error instanceof InjectableError))
                {
                    return false;
                }

                // we want to do actual matching on the error, so pass it out, so we can get better error messages
                thrownError = error;
                return true;
            });

            if (thrownError != null)
            {
                expect(thrownError.tokenNames).toEqual(["INNER_DEP"]);
            }
        });

        it("| provides diagnostic messages where a dependency is missing", () =>
        {
            const inner = new UnimplementedInjectable<number>("INNER_DEP");
            const outer = new Injectable(new InjectorToken("OUTER"), [inner], (inner) => 5 + inner);
            const module = new DiModule();

            let thrownError: InjectableError | null = null as any;
            expect(() => outer.resolveValue(module)).toThrowMatching((error) =>
            {
                if (!(error instanceof InjectableError))
                {
                    return false;
                }

                // we want to do actual matching on the error, so pass it out, so we can get better error messages
                thrownError = error;
                return true;
            });

            if (thrownError != null)
            {
                expect(thrownError.tokenNames).toEqual(["INNER_DEP", "OUTER"]);
            }
        });
    });
});