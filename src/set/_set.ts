import { setValuesToArray } from "./impl/set-values-to-array";

/**
 * @public
 * Utilities that apply to `Set`.
 */
// tslint:disable-next-line:class-name
export class _Set
{
    /** {@inheritDoc setValuesToArray} */
    public static readonly valuesToArray = setValuesToArray;

    private constructor()
    {
    }
}