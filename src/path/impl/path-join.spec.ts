import { pathJoin } from "./path-join.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> pathJoin", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
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