import { dictionaryValues } from "./impl/dictionary-values";
import { dictionaryExtend } from "./impl/dictionary-extend";
import { dictionaryCloneExtend } from "./impl/dictionary-clone-extend";

// tslint:disable-next-line:class-name
export class _Dictionary
{
    public static readonly values = dictionaryValues;
    public static readonly cloneExtend = dictionaryCloneExtend;
    public static readonly extend = dictionaryExtend;

    private constructor()
    {
    }
}