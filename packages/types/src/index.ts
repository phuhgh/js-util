// todo jack: pretty sure adding this to types ties us to this
// entry point to global types - versioned separately to allow running multiple versions of dependents in parallel
export { IDebugProtectedView, IDebugSharedObject, IDebugSharedObjectLifeCycleChecks, IDebugWeakStore, IDebugWeakBroadcastEvent, IStandardDebugFlags, TDebugListener } from "@rc-js-util/globals";

// todo jack: do we need core to export these symbols? will downstream need to install types directly?
export { ATypedArrayTuple, TTypedArrayTupleMutativeMethods, TDecayedTypedArrayTuple, TExtractIndexes } from "./impl/a-typed-array-tuple";
export { TTypedArrayCtor } from "./impl/t-typed-array-ctor";
export { IDictionary } from "./impl/i-dictionary";
export { IReadonlyDictionary } from "./impl/i-readonly-dictionary";
export { INumericKeyedDictionary } from "./impl/i-numeric-keyed-dictionary";
export { IReadonlySetLike } from "./impl/i-readonly-set-like";
export { ISetLike } from "./impl/i-set-like";
export { TExtractTypeTypedArrayTuple } from "./impl/t-extract-type-typed-array-tuple";
export { TKeysOf } from "./impl/t-keys-of";
export { TNeverFallback } from "./impl/t-never-fallback";
export { TNeverPredicate } from "./impl/t-never-predicate";
export { TNextInt } from "./impl/t-next-int";
export { TNullable } from "./impl/t-nullable";
export { TPickExcept } from "./impl/t-pick-except";
export { TPredicate } from "./impl/t-predicate";
export { TPickPartial } from "./impl/t-pick-partial";
export { TPickRequired } from "./impl/t-pick-required";
export { TProperty } from "./impl/t-property";
export { TTupleLike } from "./impl/t-tuple-like";
export { TTupleLikeOfLength } from "./impl/t-tuple-like-of-length";
export { TTypedArrayCast } from "./impl/t-typed-array-cast";
export { TUnionToIntersection } from "./impl/t-union-to-intersection";
export { TUnpackArray } from "./impl/t-unpack-array";
export { TUnpackIfArray } from "./impl/t-unpack-if-array";
export { TWriteable } from "./impl/t-writable";
export { TTypedArray } from "./impl/t-typed-array";
