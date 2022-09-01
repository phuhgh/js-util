import { pathJoin } from "./path-join.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> pathJoin", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
    });

    it("| joins as expected", () =>
    {
        expect(pathJoin("a", "b")).toEqual("a/b");
        expect(pathJoin("a/", "b")).toEqual("a/b");
        expect(pathJoin("a", "/b")).toEqual("a/b");
    });

    it("| ues the separator if provided", () =>
    {
        expect(pathJoin("a", "b", "MultiCharSep")).toEqual("aMultiCharSepb");
    });
});