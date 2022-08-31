import { promiseDelay } from "./promise-delay";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";

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