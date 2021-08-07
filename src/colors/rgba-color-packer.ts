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
        return (color & ERgbaMasks.R) >>> ERgbaShift.R;
    }

    /**
     * @param color - Bit packed color.
     * @returns a value between 0 - 255 representing the green component.
     */
    public static unpackG(color: number): number
    {
        return (color & ERgbaMasks.G) >>> ERgbaShift.G;
    }

    /**
     * @param color - Bit packed color.
     * @returns a value between 0 - 255 representing the blue component.
     */
    public static unpackB(color: number): number
    {
        return (color & ERgbaMasks.B) >>> ERgbaShift.B;
    }

    /**
     * @param color - Bit packed color.
     * @returns a value between 0 - 255 representing the alpha component.
     */
    public static unpackA(color: number): number
    {
        return (color & ERgbaMasks.A) >>> ERgbaShift.A;
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
        const tmp = RgbaColorPacker.colorStringTmp;

        tmp[1] = (color & ERgbaMasks.R) >>> ERgbaShift.R;
        tmp[3] = (color & ERgbaMasks.G) >>> ERgbaShift.G;
        tmp[5] = (color & ERgbaMasks.B) >>> ERgbaShift.B;
        tmp[7] = ((color & ERgbaMasks.A) >>> ERgbaShift.A) * 0.00392156862745098; // divide by 255

        return tmp.join("");
    }

    /**
     * Given a packed color, produce a dom color string like `#FF0000`.
     *
     * @remarks
     * Made up of only 6 components, the alpha channel will be masked out.
     */
    public static getHexColorString(value: number): string
    {
        if (value !== value)
        {
            return "NaN";
        }

        // shift off the alpha channel
        value = value >>> 8;

        RgbaColorPacker.hexColorTmp[1] = value
            .toString(16)
            .toUpperCase()
            .padStart(6, "0");

        return RgbaColorPacker.hexColorTmp.join("");
    }

    public static generateRandomPackedRGBA(): number
    {
        return ((Math.random() * 255) << ERgbaShift.R) |
               ((Math.random() * 255) << ERgbaShift.G) |
               ((Math.random() * 255) << ERgbaShift.B) |
               ((Math.random() * 255) << ERgbaShift.A);
    }

    private static colorStringTmp = ["rgba(", 1, ",", 3, ",", 5, ",", 7, ")"];
    private static hexColorTmp = ["#", 0];
}