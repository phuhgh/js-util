import { Range2d } from "../../array/typed-array/2d/range2d/range2d";

/**
 * @public
 * Utilities relating to double precision floats.
 *
 * @remarks
 * See {@link _F64}.
 */
export class _F64
{
    public static MAX_VALUE = Number.MAX_VALUE;
    public static MIN_POSITIVE_VALUE = Number.MIN_VALUE;
    public static bounds = Range2d.f64.factory.createOne(
        -Number.MAX_VALUE,
        Number.MAX_VALUE,
        -Number.MAX_VALUE,
        Number.MAX_VALUE,
    );

    public static getPrecision(value: number): number
    {
        return value * _F64.mantissaPrecision;
    }

    public static isEqual
    (
        a: number,
        b: number,
        delta: number = _F64.mantissaPrecision,
    )
        : boolean
    {
        return Math.abs(a - b) < delta;
    }

    public static readonly mantissaBits = 52;
    public static readonly mantissaPrecision = 1 / Math.pow(2, 52);
}