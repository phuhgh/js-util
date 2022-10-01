import { promiseDelay } from "./promise-delay.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> promiseDelay", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    it("| resolves the provided value", async () =>
    {
        const v = await promiseDelay(1);
        expect(v).toBe(1);
    });
});