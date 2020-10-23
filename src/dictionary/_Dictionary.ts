import { dictionaryValues } from "./impl/dictionary-values";
import { dictionaryExtend } from "./impl/dictionary-extend";
import { dictionaryCloneExtend } from "./impl/dictionary-clone-extend";
import { dictionaryForEach } from "./impl/dictionary-foreach";
import { dictionaryPairs } from "./impl/dictionary-pairs";
import { dictionaryPush } from "./impl/dictionary-push";

// tslint:disable-next-line:class-name
export class _Dictionary
{
    public static readonly cloneExtend = dictionaryCloneExtend;
    public static readonly extend = dictionaryExtend;
    public static readonly forEach = dictionaryForEach;
    public static readonly pairs = dictionaryPairs;
    public static readonly push = dictionaryPush;
    public static readonly values = dictionaryValues;

    private constructor()
    {
    }
}