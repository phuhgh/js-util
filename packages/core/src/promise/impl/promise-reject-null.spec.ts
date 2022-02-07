import { promiseRejectNull } from "./promise-reject-null";

describe("promiseRejectNull", () =>
{
    it("rejects null", async () =>
    {
        expect(() => promiseRejectNull(null, "foo")).toThrow("foo");
    });

    it("passes values", async () =>
    {
        const valueOrNull: number | null = 1;
        const value: number = await promiseRejectNull(valueOrNull, "foo");
        expect(value).toBe(1);
    });

    it("rejects promise of null", async () =>
    {
        const valueOrNull: Promise<number | null> = Promise.resolve(1);
        const value: number = await promiseRejectNull(valueOrNull, "foo");
        expect(value).toBe(1);
    });

    it("passes promise of value", async () =>
    {
        await expect(() => promiseRejectNull(Promise.resolve(null), "foo")).toThrow("foo");
    });
});