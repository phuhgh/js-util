import { promiseDelay } from "./promise-delay";

describe("=> promiseDelay", () =>
{
    test("| resolves the provided value", async () =>
    {
        const v = await promiseDelay(1);
        expect(v).toBe(1);
    });
});