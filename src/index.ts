export { IDebugWeakStore, IDebugSharedObject, IDebugSharedObjectLifeCycleChecks, TDebugListener, IDebugProtectedView, IDebugWeakBroadcastEvent } from "rc-js-util-globals/index";

export { RcJsUtilDebugImpl } from "./debug/debug-namepace";
export { Emscripten } from "../external/emscripten";
export { _Array } from "./array/_array";
export { _Debug } from "./debug/_debug";
export { _Dictionary } from "./dictionary/_-dictionary";
export { NestableError } from "./error-handling/nestable-error";
export { _Production } from "./production/_production";
export { _Fp } from "./fp/_fp";
export { _Map } from "./map/_map";
export { _Math } from "./math/_math";
export { _Number } from "./number/_number";
export { _Path } from "./path/_path";
export { _RegExp } from "./reg-exp/_reg-exp";
export { _Set } from "./set/_set";
export { _String } from "./string/_string";

export { TGetComparisonValueAtIndex } from "./array/impl/binary-find-insertion-index";
export { TTypedArrayCtor } from "./array/typed-array/t-typed-array-ctor";
export { ATypedArrayTuple, TDecayedTypedArrayTuple } from "./array/typed-array/a-typed-array-tuple";
export { ITypedArrayTupleFactory } from "./array/typed-array/i-typed-array-tuple-factory";
export { Margin2d, TF32Margin2d, TMargin2dCtorArgs, Margin2dCtor } from "./array/typed-array/2d/margin2d/margin2d";
export { Range2d, TF32Range2d, TRange2dCtorArgs, Range2dCtor } from "./array/typed-array/2d/range2d/range2d";
export { Mat2, TF32Mat2, TMat2CtorArgs, Mat2Ctor } from "./array/typed-array/mat2/mat2";
export { Mat3, TF32Mat3, TMat3CtorArgs, Mat3Ctor } from "./array/typed-array/mat3/mat3";
export { Mat4, TF32Mat4, TMat4CtorArgs, Mat4Ctor } from "./array/typed-array/mat4/mat4";
export { Vec2, TF32Vec2, TVec2CtorArgs, Vec2Ctor } from "./array/typed-array/vec2/vec2";
export { Vec3, TF32Vec3, TVec3CtorArgs, Vec3Ctor } from "./array/typed-array/vec3/vec3";
export { Vec4, TF32Vec4, TVec4CtorArgs, Vec4Ctor } from "./array/typed-array/vec4/vec4";
export { NormalizedDataViewProvider } from "./array/typed-array/normalized-data-view/normalized-data-view-provider";
export { INormalizedDataView } from "./array/typed-array/normalized-data-view/i-normalized-data-view";
export { TTypedArray } from "./array/typed-array/t-typed-array";
export { CircularBuffer } from "./collection/circular-buffer";
export { CircularFIFOStack, ECircularStackOverflowMode } from "./collection/circular-fifo-stack";
export { IFIFOStack } from "./collection/i-fifo-stack";
export { ERgbaMasks, ERgbaShift } from "./colors/e-rgba-masks";
export { RgbaColorPacker } from "./colors/rgba-color-packer";
export { TGetStringFromLocalization } from "./i18n/t-get-string-from-localization";
export { BroadcastEvent } from "./eventing/broadcast-event";
export { IBroadcastEvent } from "./eventing/i-broadcast-event";
export { TListener } from "./eventing/t-listener";
export { ReferenceCountedPtr, IReferenceCountedPtr, ISharedObject } from "./lifecycle/reference-counted-ptr";
export { AReferenceCounted, IReferenceCounted } from "./lifecycle/a-reference-counted";
export { IDictionary } from "./typescript/i-dictionary";
export { INumericKeyedDictionary } from "./typescript/i-numeric-keyed-dictionary";
export { TKeysOf } from "./typescript/t-keys-of";
export { TNextInt } from "./typescript/t-next-int";
export { TNullable } from "./typescript/t-nullable";
export { TPickExcept } from "./typescript/t-pick-except";
export { TPredicate } from "./typescript/t-predicate";
export { TTupleLike } from "./typescript/t-tuple-like";
export { TTupleLikeOfLength } from "./typescript/t-tuple-like-of-length";
export { TTypedArrayCast } from "./typescript/t-typed-array-cast";
export { TUnionToIntersection } from "./typescript/t-union-to-intersection";
export { TUnpackArray } from "./typescript/t-unpack-array";
export { TUnpackIfArray } from "./typescript/t-unpack-if-array";
export { TWriteable } from "./typescript/t-writable";
export { IEmscriptenWrapper } from "./web-assembly/emscripten/i-emscripten-wrapper";
export { getEmscriptenWrapper } from "./web-assembly/emscripten/get-emscripten-wrapper";
export { TWebAssemblyMemoryListenerArgs } from "./web-assembly/t-web-assembly-memory-listener-args";
export { ISharedArray } from "./web-assembly/shared-array/i-shared-array";
export { IWebAssemblyMemoryMemory } from "../external/i-web-assembly-memory";
export { SharedArray, TF32SharedArray, TF64SharedArray } from "./web-assembly/shared-array/shared-array";
export { SharedStaticArray, TF32SharedStaticArray, TF64SharedStaticArray } from "./web-assembly/shared-array/shared-static-array";

export { arrayBinaryIndexOf } from "./array/impl/array-binary-index-of";
export { arrayBinaryLastIndexOf } from "./array/impl/array-binary-last-index-of";
export { arrayCollect } from "./array/impl/array-collect";
export { arrayCompact } from "./array/impl/array-compact";
export { arrayCompactMap } from "./array/impl/array-compact-map";
export { arrayCopyInto } from "./array/impl/array-copy-into";
export { arrayEmptyArray } from "./array/impl/array-empty-array";
export { arrayFlatMap } from "./array/impl/array-flat-map";
export { arrayForEach } from "./array/impl/array-for-each";
export { arrayGenerateRange } from "./array/impl/array-generate-range";
export { arrayIndex } from "./array/impl/array-index";
export { arrayInsertAtIndex } from "./array/impl/array-insert-at-index";
export { arrayIntersect } from "./array/impl/array-intersect";
export { arrayIsArray } from "./array/impl/array-is-array";
export { arrayLast } from "./array/impl/array-last";
export { arrayMapRange } from "./array/impl/array-map-range";
export { arrayMap } from "./array/impl/array-map";
export { arrayContains } from "./array/impl/array-contains";
export { arrayNormalizeEmptyToUndefined } from "./array/impl/array-normalize-empty-to-undefined";
export { arrayNormalizeNullUndefinedToEmpty } from "./array/impl/array-normalize-null-undefined-to-empty";
export { arrayPushUnique } from "./array/impl/array-push-unique";
export { arrayRemoveMany } from "./array/impl/array-remove-many";
export { arrayRemoveOne } from "./array/impl/array-remove-one";
export { arrayReplaceOne } from "./array/impl/array-replace-one";
export { arrayUnion } from "./array/impl/array-union";
export { dictionaryCloneExtend } from "./dictionary/impl/dictionary-clone-extend";
export { dictionaryExtend } from "./dictionary/impl/dictionary-extend";
export { dictionaryForEach } from "./dictionary/impl/dictionary-foreach";
export { dictionaryPairs } from "./dictionary/impl/dictionary-pairs";
export { dictionaryPush } from "./dictionary/impl/dictionary-push";
export { dictionaryValues } from "./dictionary/impl/dictionary-values";
export { Once } from "./decorators/once";
export { fpIdentity } from "./fp/impl/fp-identity";
export { fpMaybeNewValue } from "./fp/impl/fp-maybe-new-value";
export { fpNoOp } from "./fp/impl/fp-no-op";
export { fpNormalizeToNull } from "./fp/impl/fp-normalize-to-null";
export { fpNormalizeToUndefined } from "./fp/impl/fp-normalize-to-undefined";
export { fpOnce } from "./fp/impl/fp-once";
export { fpValueOrNull } from "./fp/impl/fp-value-or-null";
export { promiseRejectFalsey } from "./promise/impl/promise-reject-falsey";
export { promiseRejectNull } from "./promise/impl/promise-reject-null";
export { mapArrayMap } from "./map/impl/map-array-map";
export { mapDeleteGet } from "./map/impl/map-delete-get";
export { mapEntriesToArray } from "./map/impl/map-entries-to-array";
export { mapFirstKey } from "./map/impl/map-first-key";
export { mapFirstValue } from "./map/impl/map-first-value";
export { mapInitializeGet } from "./map/impl/map-intialize-get";
export { mapKeysToArray } from "./map/impl/map-keys-to-array";
export { mapPush } from "./map/impl/map-push";
export { mapValuesToArray } from "./map/impl/map-values-to-array";
export { mathBound } from "./math/impl/math-bound";
export { mathBoundRandom } from "./math/impl/math-bound-random";
export { mathMax } from "./math/impl/math-max";
export { mathMin } from "./math/impl/math-min";
export { numberGetHexString } from "./number/impl/number-get-hex-string";
export { pathJoin } from "./path/impl/path-join";
export { regexEscapeRegex } from "./reg-exp/impl/regex-escape-regex";
export { setValuesToArray } from "./set/impl/set-values-to-array";
export { stringNormalizeEmptyToUndefined } from "./string/impl/string-normalize-empty-to-undefined";
export { stringNormalizeNullUndefinedToEmpty } from "./string/impl/string-normalize-null-undefined-to-empty";
