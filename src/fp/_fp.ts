import { fpIdentity } from "./impl/fp-identity";
import { fpNormalizeToNull } from "./impl/fp-normalize-to-null";
import { fpNormalizeToUndefined } from "./impl/fp-normalize-to-undefined";
import { fpOnce } from "./impl/fp-once";
import { fpRejectFalse } from "./impl/fp-reject-false";
import { fpRejectNull } from "./impl/fp-reject-null";

// tslint:disable-next-line:class-name
export class _Fp
{
    public static readonly identity = fpIdentity;
    public static readonly normalizeToNull = fpNormalizeToNull;
    public static readonly normalizeToUndefined = fpNormalizeToUndefined;
    public static readonly once = fpOnce;
    public static readonly rejectFalse = fpRejectFalse;
    public static readonly rejectNull = fpRejectNull;

    private constructor()
    {
    }
}
