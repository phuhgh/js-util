import { RgbaColorPacker } from "./rgba-color-packer";
import { ERgbaShift } from "./e-rgba-masks";
import { resetDebugState } from "@rc-js-util/test";

describe("=> RgbaColorPacker", () =>
{
    const red = RgbaColorPacker.packColor(255, 0, 0, 0);
    const green = RgbaColorPacker.packColor(0, 255, 0, 0);
    const blue = RgbaColorPacker.packColor(0, 0, 255, 0);
    const alpha = RgbaColorPacker.packColor(0, 0, 0, 255);

    beforeEach(() => resetDebugState());

    describe("packColor", () =>
    {
        test("| packs red", () =>
        {
            expect(red).toEqual(0xFF << ERgbaShift.R);
        });

        test("| packs green", () =>
        {
            expect(green).toEqual(0xFF << ERgbaShift.G);
        });

        test("| packs blue", () =>
        {
            expect(blue).toEqual(0xFF << ERgbaShift.B);
        });

        test("| packs alpha", () =>
        {
            expect(alpha).toEqual(0xFF << ERgbaShift.A);
        });
    });

    describe("unpack", () =>
    {
        test("| unpacks red", () =>
        {
            expect(RgbaColorPacker.unpackR(red)).toEqual(0xFF);
        });

        test("| unpacks green", () =>
        {
            expect(RgbaColorPacker.unpackG(green)).toEqual(0xFF);
        });

        test("| unpacks blue", () =>
        {
            expect(RgbaColorPacker.unpackB(blue)).toEqual(0xFF);
        });

        test("| unpacks alpha", () =>
        {
            expect(RgbaColorPacker.unpackA(alpha)).toEqual(0xFF);
        });
    });

    describe("getHexColorString", () =>
    {
        test("| packs red", () =>
        {
            expect(RgbaColorPacker.getHexColorString(RgbaColorPacker.packColor(255, 0, 0, 255))).toEqual("#FF0000");
        });

        test("| packs green", () =>
        {
            expect(RgbaColorPacker.getHexColorString(RgbaColorPacker.packColor(0, 255, 0, 255))).toEqual("#00FF00");
        });

        test("| packs blue", () =>
        {
            expect(RgbaColorPacker.getHexColorString(RgbaColorPacker.packColor(0, 0, 255, 255))).toEqual("#0000FF");
        });
    });
});
