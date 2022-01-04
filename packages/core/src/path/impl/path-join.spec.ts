import { pathJoin } from "./path-join";
import { resetDebugState } from "@rc-js-util/test";

describe("=> pathJoin", () =>
{
    beforeEach(() => resetDebugState());

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