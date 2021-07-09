import { ERgbaMasks, ERgbaShift } from "./e-rgba-masks";

/**
 * @public
 * Utility for packing and unpacking RGBA into int32 with one byte per channel.
 */
export class RgbaColorPacker
{
    /**
     * @param color - Bit packed color.
     * @returns a value between 0 - 255 representing the red component.
     */
    public static unpackR(color: number): number
    {
        return (color & ERgbaMasks.R) >> ERgbaShift.R;
    }

    /**
     * @param color - Bit packed color.
     * @returns a value between 0 - 255 representing the green component.
     */
    public static unpackG(color: number): number
    {
        return (color & ERgbaMasks.G) >> ERgbaShift.G;
    }

    /**
     * @param color - Bit packed color.
     * @returns a value between 0 - 255 representing the blue component.
     */
    public static unpackB(color: number): number
    {
        return (color & ERgbaMasks.B) >> ERgbaShift.B;
    }

    /**
     * @param color - Bit packed color.
     * @returns a value between 0 - 255 representing the alpha component.
     */
    public static unpackA(color: number): number
    {
        return (color & ERgbaMasks.A) >> ERgbaShift.A;
    }

    /**
     *
     * @param r - Red 0 - 255.
     * @param g - Green 0 - 255.
     * @param b - Blue 0 - 255.
     * @param a - Alpha 0 - 255.
     */
    public static packColor(r: number, g: number, b: number, a: number): number
    {
        return (r << ERgbaShift.R) |
               (g << ERgbaShift.G) |
               (b << ERgbaShift.B) |
               (a << ERgbaShift.A);
    }

    /**
     * Given a packed color, produce a dom color string like `rgba(255, 255, 255, 1)`.
     */
    public static makeDomColorString(color: number): string
    {
        const tmp = RgbaColorPacker.tmp;

        tmp[1] = (color & ERgbaMasks.R) >>> ERgbaShift.R;
        tmp[3] = (color & ERgbaMasks.G) >>> ERgbaShift.G;
        tmp[5] = (color & ERgbaMasks.B) >>> ERgbaShift.B;
        tmp[7] = ((color & ERgbaMasks.A) >>> ERgbaShift.A) * 0.0039215686274509803921568627451; // divide by 255

        return tmp.join("");
    }

    public static generateRandomPackedRGBA(): number
    {
        return ((Math.random() * 255) << ERgbaShift.R) |
               ((Math.random() * 255) << ERgbaShift.G) |
               ((Math.random() * 255) << ERgbaShift.B) |
               ((Math.random() * 255) << ERgbaShift.A);
    }

    private static tmp = ["rgba(", 1, ",", 3, ",", 5, ",", 7, ")"];
}