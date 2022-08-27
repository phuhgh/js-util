import { pathJoin } from "./path-join";
import { setDefaultUnitTestFlags } from "../../test-utils";

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