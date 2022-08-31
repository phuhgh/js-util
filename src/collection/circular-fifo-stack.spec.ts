import { CircularFIFOStack, ECircularStackOverflowMode } from "./circular-fifo-stack";
import { setDefaultUnitTestFlags } from "../test-util/set-default-unit-test-flags";

describe("=> CircularFIFOStack", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    describe("=> getIsEmpty", () =>
    {
        it("| returns true if empty", () =>
        {
            const stack = new CircularFIFOStack(4, ECircularStackOverflowMode.Exception);
            expect(stack.getIsEmpty()).toBe(true);
            stack.push(1);
            expect(stack.getIsEmpty()).toBe(false);
            stack.pop();
            expect(stack.getIsEmpty()).toBe(true);
        });
    });

    describe("=> getRemainingCapacity", () =>
    {
        it("| returns the number of pushes left", () =>
        {
            const stack = new CircularFIFOStack(4, ECircularStackOverflowMode.Exception);
            expect(stack.getRemainingCapacity()).toBe(4);
            stack.push(1);
            expect(stack.getRemainingCapacity()).toBe(3);
            stack.push(2);
            stack.push(3);
            stack.push(4);
            expect(stack.getRemainingCapacity()).toBe(0);
        });
    });

    describe("=> pop", () =>
    {
        it("| errors if the stack is empty", () =>
        {
            const stack = new CircularFIFOStack(4);
            expect(() => stack.pop()).toThrow();
        });

        it("| returns the expected values", () =>
        {
            const stack = new CircularFIFOStack(4, ECircularStackOverflowMode.Exception);
            stack.push(1);
            stack.push(2);
            expect(stack.pop()).toBe(1);
            expect(stack.pop()).toBe(2);
            stack.push(3);
            stack.push(4);
            expect(stack.pop()).toBe(3);
            expect(stack.pop()).toBe(4);
            stack.push(5);
            stack.push(6);
            expect(stack.pop()).toBe(5);
            expect(stack.pop()).toBe(6);
        });
    });

    describe("=> push", () =>
    {
        describe("=> when overflow mode grow", () =>
        {
            it("| grows the stack", () =>
            {
                const stack = new CircularFIFOStack(4, ECircularStackOverflowMode.Grow);
                stack.push(1);
                stack.push(2);
                stack.push(3);
                stack.push(4);
                expect(stack.getCapacity()).toBe(4);
                stack.push(5);
                expect(stack.getCapacity()).toBe(8);
                expect(stack.pop()).toBe(1);
                expect(stack.pop()).toBe(2);
                expect(stack.pop()).toBe(3);
                expect(stack.pop()).toBe(4);
                expect(stack.pop()).toBe(5);
                expect(stack.getIsEmpty()).toBe(true);
                expect(() => stack.pop()).toThrow();
            });
        });

        describe("=> when overflow mode no op", () =>
        {
            it("| does nothing", () =>
            {
                const stack = new CircularFIFOStack(4, ECircularStackOverflowMode.NoOp);
                stack.push(1);
                stack.push(2);
                stack.push(3);
                stack.push(4);
                expect(stack.getCapacity()).toBe(4);
                stack.push(5);
                expect(stack.getCapacity()).toBe(4);
                expect(stack.pop()).toBe(1);
                expect(stack.pop()).toBe(2);
                expect(stack.pop()).toBe(3);
                expect(stack.pop()).toBe(4);
                expect(stack.getIsEmpty()).toBe(true);
                expect(() => stack.pop()).toThrow();
            });
        });

        describe("=> when overflow mode exception", () =>
        {
            it("| doesn't write and throws an exception", () =>
            {
                const stack = new CircularFIFOStack(4, ECircularStackOverflowMode.Exception);
                stack.push(1);
                stack.push(2);
                stack.push(3);
                stack.push(4);
                expect(stack.getCapacity()).toBe(4);
                expect(() => stack.push(5)).toThrow();
                expect(stack.getCapacity()).toBe(4);
                expect(stack.pop()).toBe(1);
                expect(stack.pop()).toBe(2);
                expect(stack.pop()).toBe(3);
                expect(stack.pop()).toBe(4);
                expect(stack.getIsEmpty()).toBe(true);
                expect(() => stack.pop()).toThrow();
            });
        });

        describe("=> when overflow mode overwrite", () =>
        {
            it("| overwrites the first in", () =>
            {
                const stack = new CircularFIFOStack(4, ECircularStackOverflowMode.Overwrite);
                stack.push(1);
                stack.push(2);
                stack.push(3);
                stack.push(4);
                expect(stack.getCapacity()).toBe(4);
                stack.push(5);
                expect(stack.getCapacity()).toBe(4);
                expect(stack.pop()).toBe(2);
                expect(stack.pop()).toBe(3);
                expect(stack.pop()).toBe(4);
                expect(stack.pop()).toBe(5);
                expect(stack.getIsEmpty()).toBe(true);
                expect(() => stack.pop()).toThrow();
            });
        });
    });
});