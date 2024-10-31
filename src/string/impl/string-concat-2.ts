/**
 * @public
 * Like concat but for only 2 parameters (yes it's dumb, but it can be a lot faster for lots of small joins).
 *
 * @remarks
 * See {@link stringConcat2}.
 */
export function stringConcat2(a: string, b: string, sep: string = ""): string
{
    tmp[0] = a;
    tmp[1] = b;
    const result = tmp.join(sep);
    tmp[0] = "";
    tmp[1] = "";
    return result;
}

const tmp = ["", ""];