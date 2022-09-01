import { promiseDelay } from "./promise-delay.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> promiseDelay", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| resolves the provided value", async () =>
    {
        const v = await promiseDelay(1);
        expect(v).toBe(1);
    });
});