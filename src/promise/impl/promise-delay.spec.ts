import { promiseDelay } from "./promise-delay";

describe("=> promiseDelay", () =>
{
    it("| resolves the provided value", async () =>
    {
        const v = await promiseDelay(1);
        expect(v).toBe(1);
    });
});