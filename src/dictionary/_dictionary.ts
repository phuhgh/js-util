import { dictionaryValues } from "./impl/dictionary-values";
import { dictionaryExtend } from "./impl/dictionary-extend";
import { dictionaryCloneExtend } from "./impl/dictionary-clone-extend";
import { dictionaryForEach } from "./impl/dictionary-foreach";
import { dictionaryPairs } from "./impl/dictionary-pairs";
import { dictionaryPush } from "./impl/dictionary-push";

/**
 * @public
 * Utilities for 'dictionaries', i.e. \{ [index: string]: any \}.
 */
export class _Dictionary
{
    /** {@inheritDoc dictionaryCloneExtend} */
    public static readonly cloneExtend = dictionaryCloneExtend;

    /** {@inheritDoc dictionaryExtend} */
    public static readonly extend = dictionaryExtend;

    /** {@inheritDoc dictionaryForEach} */
    public static readonly forEach = dictionaryForEach;

    /** {@inheritDoc dictionaryPairs} */
    public static readonly pairs = dictionaryPairs;

    /** {@inheritDoc dictionaryPush} */
    public static readonly push = dictionaryPush;

    /** {@inheritDoc dictionaryValues} */
    public static readonly values = dictionaryValues;

    private constructor()
    {
    }
}