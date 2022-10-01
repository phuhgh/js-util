import { RgbaColorPacker } from "./rgba-color-packer.js";
import { ERgbaShift } from "./e-rgba-masks.js";
import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";

describe("=> RgbaColorPacker", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const red = RgbaColorPacker.packColor(255, 0, 0, 0);
    const green = RgbaColorPacker.packColor(0, 255, 0, 0);
    const blue = RgbaColorPacker.packColor(0, 0, 255, 0);
    const alpha = RgbaColorPacker.packColor(0, 0, 0, 255);

    describe("packColor", () =>
    {
        it("| packs red", () =>
        {
            expect(red).toEqual(0xFF << ERgbaShift.R);
        });

        it("| packs green", () =>
        {
            expect(green).toEqual(0xFF << ERgbaShift.G);
        });

        it("| packs blue", () =>
        {
            expect(blue).toEqual(0xFF << ERgbaShift.B);
        });

        it("| packs alpha", () =>
        {
            expect(alpha).toEqual(0xFF << ERgbaShift.A);
        });
    });

    describe("unpack", () =>
    {
        it("| unpacks red", () =>
        {
            expect(RgbaColorPacker.unpackR(red)).toEqual(0xFF);
        });

        it("| unpacks green", () =>
        {
            expect(RgbaColorPacker.unpackG(green)).toEqual(0xFF);
        });

        it("| unpacks blue", () =>
        {
            expect(RgbaColorPacker.unpackB(blue)).toEqual(0xFF);
        });

        it("| unpacks alpha", () =>
        {
            expect(RgbaColorPacker.unpackA(alpha)).toEqual(0xFF);
        });
    });

    describe("getHexColorString", () =>
    {
        it("| packs red", () =>
        {
            expect(RgbaColorPacker.getHexColorString(RgbaColorPacker.packColor(255, 0, 0, 255))).toEqual("#FF0000");
        });

        it("| packs green", () =>
        {
            expect(RgbaColorPacker.getHexColorString(RgbaColorPacker.packColor(0, 255, 0, 255))).toEqual("#00FF00");
        });

        it("| packs blue", () =>
        {
            expect(RgbaColorPacker.getHexColorString(RgbaColorPacker.packColor(0, 0, 255, 255))).toEqual("#0000FF");
        });
    });
});