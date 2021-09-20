import { Range2d } from "../../array/typed-array/2d/range2d/range2d";

/**
 * @public
 */
export class _F32
{
    public static MAX_VALUE = (2 - Math.pow(2, -23)) * Math.pow(2, 127);
    public static MIN_POSITIVE_VALUE = Math.pow(2, -126);
    public static bounds = Range2d.f32.factory.createOne(
        -_F32.MAX_VALUE,
        _F32.MAX_VALUE,
        -_F32.MAX_VALUE,
        _F32.MAX_VALUE,
    );

    public static getPrecision(value: number): number
    {
        return value * _F32.mantissaPrecision;
    }

    public static isEqual
    (
        a: number,
        b: number,
        delta: number = _F32.mantissaPrecision,
    )
        : boolean
    {
        return Math.abs(a - b) < delta;
    }

    private static readonly mantissaPrecision = 1 / Math.pow(2, 23);
}
