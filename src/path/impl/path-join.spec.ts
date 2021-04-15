/* tslint:disable:newline-per-chained-call */
import { pathJoin } from "./path-join";

describe("=> pathJoin", () =>
{
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