import { isLittleEndian } from "./is-little-endian.js";

describe("=> isLittleEndian", () =>
{
    it("| returns true...", () =>
    {
        // little bit pointless...
        expect(isLittleEndian).toBe(true);
    });
});