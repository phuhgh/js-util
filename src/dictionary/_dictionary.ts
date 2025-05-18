import { dictionaryValues } from "./impl/dictionary-values.js";
import { dictionaryOverwrite } from "./impl/dictionary-overwrite.js";
import { dictionaryCloneExtend } from "./impl/dictionary-clone-extend.js";
import { dictionaryForEach } from "./impl/dictionary-foreach.js";
import { dictionaryPairs } from "./impl/dictionary-pairs.js";
import { dictionaryPush } from "./impl/dictionary-push.js";
import { dictionaryCollect } from "./impl/dictionary-collect.js";

/**
 * @public
 * Utilities for 'dictionaries', i.e. \{ [index: string]: any \}.
 */
export class _Dictionary
{
    /** {@inheritDoc dictionaryCloneExtend} */
    public static readonly cloneExtend = dictionaryCloneExtend;

    /** {@inheritDoc dictionaryCollect} */
    public static readonly collect = dictionaryCollect;

    /** {@inheritDoc dictionaryOverwrite} */
    public static readonly overwrite = dictionaryOverwrite;

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