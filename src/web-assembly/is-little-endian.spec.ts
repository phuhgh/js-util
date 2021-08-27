import { isLittleEndian } from "./is-little-endian";

describe("=> isLittleEndian", () =>
{
    it("| returns true...", () =>
    {
        // little bit pointless...
        expect(isLittleEndian).toBe(true);
    });
});