import "rc-js-util-globals";
import { IDebugBuildFlags } from "./debug/i-debug-build-flags.js";
import { IWasmBuildFlags } from "./web-assembly/i-wasm-build-flags.js";

export { Emscripten, IWebAssemblyMemoryMemory } from "./external/emscripten.js";

export { IDebugProtectedViewFactory } from "./debug/i-debug-protected-view-factory.js";
export { DebugWeakStore } from "./debug/debug-weak-store.js";
export { _Debug } from "./debug/_debug.js";

export { _Array } from "./array/_array.js";
export { _Dictionary } from "./dictionary/_dictionary.js";
export { _Equality } from "./equality/_equality.js";
export { INestedError, INestedErrorCtor, INestedErrorCtorConfig, getNestedErrorCtor, IErrorSummary } from "./error-handling/nested-error-factory.js";
export { NestedError } from "./error-handling/nested-error.js";
export { _Production } from "./production/_production.js";
export { _Promise } from "./promise/_promise.js";
export { _Fp } from "./fp/_fp.js";
export { _Identifier } from "./identifier/_identifier.js";
export { _Iterator } from "./iterators/_iterator.js";
export { _Map } from "./map/_map.js";
export { _Math } from "./math/_math.js";
export { _F32 } from "./number/impl/_f32.js";
export { _F64 } from "./number/impl/_f64.js";
export { _Number } from "./number/_number.js";
export { _Path } from "./path/_path.js";
export { _RegExp } from "./reg-exp/_reg-exp.js";
export { _Set } from "./set/_set.js";
export { _String } from "./string/_string.js";

export { TGetComparisonValueAtIndex } from "./array/impl/binary-find-insertion-index.js";
export { arrayBinaryFindInsertionIndex } from "./array/impl/array-binary-find-insertion-index.js";
export { TTypedArrayCtor, TFullSetTypedArrayCtor } from "./array/typed-array/t-typed-array-ctor.js";
export { ATypedArrayTuple, TDecayedTypedArrayTuple, TExtractIndexes, TTypedArrayTupleMutativeMethods } from "./array/typed-array/a-typed-array-tuple.js";
export { ITypedArrayTupleFactory } from "./array/typed-array/i-typed-array-tuple-factory.js";
export { Margin2d, TF32Margin2d, TMargin2dCtorArgs, IMargin2dCtor, TF64Margin2d, IReadonlyMargin2d } from "./array/typed-array/2d/margin2d/margin2d.js";
export { Range2d, TF32Range2d, TRange2dCtorArgs, IRange2dCtor, TF64Range2d, IReadonlyRange2d } from "./array/typed-array/2d/range2d/range2d.js";
export { Mat2, TF32Mat2, TMat2CtorArgs, IMat2Ctor, TF64Mat2, IReadonlyMat2 } from "./array/typed-array/mat2/mat2.js";
export { Mat3, TF32Mat3, TMat3CtorArgs, IMat3Ctor, TF64Mat3, IReadonlyMat3 } from "./array/typed-array/mat3/mat3.js";
export { Mat4, TF32Mat4, TMat4CtorArgs, IMat4Ctor, TF64Mat4, IReadonlyMat4 } from "./array/typed-array/mat4/mat4.js";
export { Vec2, TF32Vec2, TVec2CtorArgs, IVec2Ctor, TF64Vec2, IReadonlyVec2 } from "./array/typed-array/vec2/vec2.js";
export { Range1d, TF32Range1d, TF64Range1d, TRange1dCtorArgs, IRange1dCtor, IReadonlyRange1d } from "./array/typed-array/vec2/range1d/range1d.js";
export { Vec3, TF32Vec3, TVec3CtorArgs, IVec3Ctor, TF64Vec3, IReadonlyVec3 } from "./array/typed-array/vec3/vec3.js";
export { Vec4, TF32Vec4, TVec4CtorArgs, IVec4Ctor, TF64Vec4, IReadonlyVec4 } from "./array/typed-array/vec4/vec4.js";
export { NormalizedDataViewProvider } from "./array/typed-array/normalized-data-view/normalized-data-view-provider.js";
export { INormalizedDataView } from "./array/typed-array/normalized-data-view/i-normalized-data-view.js";
export { TTypedArray } from "./array/typed-array/t-typed-array.js";
export { ITypedArrayExtensions } from "./array/typed-array/i-typed-array-extensions.js";
export { ITypedArrayCtor } from "./array/typed-array/i-typed-array-ctor.js";
export type { IBuffer } from "./array/typed-array/i-buffer-view.js";
export {
    ENumberIdentifier,
    getNumberIdentifier,
    numberSpecializations,
    IdSpecialization,
    getNumberSpecialization,
    numberCategory,
    IdCategory,
    bufferCategory,
    IStableStore,
    StableIdStore,
    StableId,
} from "./runtime/rtti-interop.js";
export { ISharedTypedArrayTuple, SharedTypedArrayTuple, TExtendedTypedArrayCtor } from "./array/typed-array/shared-typed-array-tuple.js";
export { CircularBuffer } from "./collection/circular-buffer.js";
export { CircularFIFOStack, ECircularStackOverflowMode } from "./collection/circular-fifo-stack.js";
export { DirtyCheckedUniqueCollection, IDirtyCheckedUniqueCollection } from "./collection/dirty-checked-unique-collection.js";
export { IFIFOStack } from "./collection/i-fifo-stack.js";
export { ReferenceCounter } from "./collection/reference-counter.js";
export { ERgbaMasks, ERgbaShift } from "./colors/e-rgba-masks.js";
export { RgbaColorPacker } from "./colors/rgba-color-packer.js";
export { DebugProtectedView } from "./debug/debug-protected-view.js";
export { IncrementingIdentifierFactory } from "./identifier/impl/incrementing-identifier-factory.js";
export { BroadcastChannel } from "./eventing/broadcast-channel.js";
export { IBroadcastChannel } from "./eventing/i-broadcast-channel.js";
export { TListener } from "./eventing/t-listener.js";
export { IManagedResourceLinks } from "./lifecycle/managed-resource-links.js";
export { CleanupRegistry, ICleanupRegistry } from "./lifecycle/cleanup-registry.js";
export { IManagedResourceNode, IManagedObject, IOnFreeListener, IPointer, PointerDebugMetadata } from "./lifecycle/manged-resources.js";
export { ITreeNodeLike } from "./tree/tree-model.js";
export { _Tree } from "./tree/_tree.js";
export { treeIterate } from "./tree/impl/tree-iterate.js";
export { treeCollect } from "./tree/impl/tree-collect.js";
export { IContextlessFn } from "./typescript/i-contextless-function.js";
export { IDictionary } from "./typescript/i-dictionary.js";
export { IReadonlyDictionary } from "./typescript/i-readonly-dictionary.js";
export { INumericKeyedDictionary } from "./typescript/i-numeric-keyed-dictionary.js";
export { IReadonlySetLike } from "./typescript/i-readonly-set-like.js";
export { ISetLike } from "./typescript/i-set-like.js";
export { TObjectValue } from "./typescript/t-object-value.js";
export { TExtractTypeTypedArrayTuple } from "./typescript/t-extract-type-typed-array-tuple.js";
export { TKeysOf } from "./typescript/t-keys-of.js";
export { TMaybeObject } from "./typescript/t-maybe-object.js";
export { TNeverFallback } from "./typescript/t-never-fallback.js";
export { TNeverPredicate } from "./typescript/t-never-predicate.js";
export { TNextInt } from "./typescript/t-next-int.js";
export { TNullable } from "./typescript/t-nullable.js";
export { TPickExcept } from "./typescript/t-pick-except.js";
export { TPredicate } from "./typescript/t-predicate.js";
export { TPickPartial } from "./typescript/t-pick-partial.js";
export { TPickRequired } from "./typescript/t-pick-required.js";
export { TProperty } from "./typescript/t-property.js";
export { TTupleLike } from "./typescript/t-tuple-like.js";
export { TTupleLikeOfLength } from "./typescript/t-tuple-like-of-length.js";
export { TTypedArrayCast } from "./typescript/t-typed-array-cast.js";
export { TUnionToIntersection } from "./typescript/t-union-to-intersection.js";
export { TUnpackArray } from "./typescript/t-unpack-array.js";
export { TUnpackIfArray } from "./typescript/t-unpack-if-array.js";
export { TWriteable } from "./typescript/t-writable.js";
export { nullPtr } from "./web-assembly/emscripten/null-pointer.js";
export { IInteropBindings } from "./web-assembly/emscripten/i-interop-bindings.js";
export { IEmscriptenWrapper, IEmscriptenDebugUtils, IEmscriptenBinder } from "./web-assembly/emscripten/i-emscripten-wrapper.js";
export { getEmscriptenWrapper, EmscriptenWrapperOptions } from "./web-assembly/emscripten/get-emscripten-wrapper.js";
export { ISharedArray } from "./web-assembly/shared-array/i-shared-array.js";
export { SharedArray, sharedArraySpecialization } from "./web-assembly/shared-array/shared-array.js";
export { ISharedArrayBindings } from "./web-assembly/shared-array/i-shared-array-bindings.js";
export { ITypedArrayTuple, TypedArrayTuple } from "./web-assembly/shared-array/typed-array-tuple.js";
export { IResizableArrayBindings } from "./web-assembly/resizable-array/i-resizable-array-bindings.js";
export { resizableArraySpecialization, ResizableArray } from "./web-assembly/resizable-array/resizable-array.js";
export { EVectorIdentifier, ISharedVectorBindings } from "./web-assembly/resizable-array/i-shared-vector-bindings.js";
export { IMemoryUtilBindings } from "./web-assembly/emscripten/i-memory-util-bindings.js";
export { TWebAssemblyMemoryListenerArgs } from "./web-assembly/util/t-web-assembly-memory-listener-args.js";
export { isLittleEndian } from "./web-assembly/util/is-little-endian.js";
export { SharedObjectCleanup, ESharedObjectOwnerKind } from "./web-assembly/shared-memory/shared-object-cleanup.js";
export { SharedMemoryBlock, ISharedMemoryBlock } from "./web-assembly/shared-memory/shared-memory-block.js";
export { SharedBufferView, ISharedBufferView } from "./web-assembly/shared-memory/shared-buffer-view.js";
export { IJsUtilBindings } from "./web-assembly/i-js-util-bindings.js";
export { WasmErrorCause } from "./web-assembly/wasm-error-cause.js";
export { IDebugBindings } from "./web-assembly/emscripten/i-debug-bindings.js";
export { IEmscriptenBindings } from "./web-assembly/emscripten/i-emscripten-bindings.js";
export { IOnMemoryResize } from "./web-assembly/emscripten/i-on-memory-resize.js";
export { ReferenceCountedStrategy } from "./web-assembly/emscripten/reference-counted-strategy.js";
export { AutomaticGcStrategy } from "./web-assembly/emscripten/automatic-gc-strategy.js";
export { ILifecycleStrategy } from "./web-assembly/emscripten/i-lifecycle-strategy.js";
export { blockScope } from "./lifecycle/block-scoped-lifecycle.js";
export { WorkerPool, IWorkerPool, IWorkerPoolConfig, EWorkerPoolOverflowMode, WorkerPoolErrorCause } from "./web-assembly/worker-pool/worker-pool.js";
export { getEmscriptenTestModuleOptions, ISanitizedTestModuleOptions, SanitizedEmscriptenTestModule, IErrorExclusions } from "./web-assembly/emscripten/sanitized-emscripten-test-module.js";
export { IWorkerPoolBindings } from "./web-assembly/worker-pool/i-worker-pool-bindings.js";

export { arrayAddToSet } from "./array/impl/array-add-to-set.js";
export { arrayBinaryIndexOf } from "./array/impl/array-binary-index-of.js";
export { arrayBinaryLastIndexOf } from "./array/impl/array-binary-last-index-of.js";
export { arrayCollect } from "./array/impl/array-collect.js";
export { arrayCompact } from "./array/impl/array-compact.js";
export { arrayCompactMap } from "./array/impl/array-compact-map.js";
export { arrayCopyInto } from "./array/impl/array-copy-into.js";
export { arrayEmptyArray } from "./array/impl/array-empty-array.js";
export { arrayFlatMap } from "./array/impl/array-flat-map.js";
export { arrayForEach } from "./array/impl/array-for-each.js";
export { arrayForEachRange } from "./array/impl/array-for-each-range.js";
export { arrayGenerateRange } from "./array/impl/array-generate-range.js";
export { arrayIndex } from "./array/impl/array-index.js";
export { arrayInsertAtIndex } from "./array/impl/array-insert-at-index.js";
export { arrayIntersect } from "./array/impl/array-intersect.js";
export { arrayIsArray } from "./array/impl/array-is-array.js";
export { arrayIsNotEmpty } from "./array/impl/array-is-not-empty.js";
export { arrayLast } from "./array/impl/array-last.js";
export { arrayMapRange } from "./array/impl/array-map-range.js";
export { arrayMax } from "./array/impl/array-max.js";
export { arrayMap } from "./array/impl/array-map.js";
export { arrayContains } from "./array/impl/array-contains.js";
export { arrayNormalizeEmptyToUndefined } from "./array/impl/array-normalize-empty-to-undefined.js";
export { arrayNormalizeNullishToEmpty } from "./array/impl/array-normalize-nullish-to-empty.js";
export { arrayPushUnique } from "./array/impl/array-push-unique.js";
export { arrayRemoveMany } from "./array/impl/array-remove-many.js";
export { arrayRemoveOne } from "./array/impl/array-remove-one.js";
export { arrayReplaceOne } from "./array/impl/array-replace-one.js";
export { arraySetDifference } from "./array/impl/array-set-difference.js";
export { arraySymmetricDifference } from "./array/impl/array-symmetric-difference.js";
export { arrayUnion } from "./array/impl/array-union.js";
export { arrayUnique } from "./array/impl/array-unique.js";
export { dictionaryCloneExtend } from "./dictionary/impl/dictionary-clone-extend.js";
export { dictionaryCollect } from "./dictionary/impl/dictionary-collect.js";
export { dictionaryOverwrite } from "./dictionary/impl/dictionary-overwrite.js";
export { dictionaryForEach } from "./dictionary/impl/dictionary-foreach.js";
export { dictionaryPairs } from "./dictionary/impl/dictionary-pairs.js";
export { dictionaryPush } from "./dictionary/impl/dictionary-push.js";
export { dictionaryValues } from "./dictionary/impl/dictionary-values.js";
export { equalityAllEqual } from "./equality/impl/equality-all-equal.js";
export { equalityAreConsistentlyDefined } from "./equality/impl/equality-are-consistently-defined.js";
export { Once } from "./decorator/once.js";
export { fpDebounce, TDebouncedFn } from "./fp/impl/fp-debounce.js";
export { fpIdentity } from "./fp/impl/fp-identity.js";
export { fpMaybeNewValue } from "./fp/impl/fp-maybe-new-value.js";
export { fpNoOp } from "./fp/impl/fp-no-op.js";
export { fpNormalizeToNull } from "./fp/impl/fp-normalize-to-null.js";
export { fpNormalizeToUndefined } from "./fp/impl/fp-normalize-to-undefined.js";
export { fpOnce } from "./fp/impl/fp-once.js";
export { EResolutionState, promisePoll, INonblockingPoll } from "./promise/impl/promise-poll.js";
export { promiseDelay } from "./promise/impl/promise-delay.js";
export { promiseRejectFalse } from "./promise/impl/promise-reject-false.js";
export { promiseRejectFalsey } from "./promise/impl/promise-reject-falsey.js";
export { fpRunWithin } from "./fp/impl/fp-run-within.js";
export { fpValueOrNull } from "./fp/impl/fp-value-or-null.js";
export { promiseRejectNull } from "./promise/impl/promise-reject-null.js";
export { iteratorEmptyIterator } from "./iterators/impl/iterator-empty-iterator.js";
export { iteratorConsumeAll } from "./iterators/impl/iterator-consume-all.js";
export { IncrementalUpdater, IIncrementalUpdater, IIncrementallyUpdatable } from "./iterators/incremental-updater.js";
export { mapAddToSet } from "./map/impl/map-add-to-set.js";
export { mapArrayMap } from "./map/impl/map-array-map.js";
export { mapClearingDeleteFromSet } from "./map/impl/map-clearing-delete-from-set.js";
export { mapConcat } from "./map/impl/map-concat.js";
export { mapDeleteFromSet } from "./map/impl/map-delete-from-set.js";
export { mapDeleteGet } from "./map/impl/map-delete-get.js";
export { mapEntriesToArray } from "./map/impl/map-entries-to-array.js";
export { mapFirstKey } from "./map/impl/map-first-key.js";
export { mapFirstValue } from "./map/impl/map-first-value.js";
export { mapInitializeGet } from "./map/impl/map-intialize-get.js";
export { mapIntersect } from "./map/impl/map-intersect.js";
export { mapKeysToArray } from "./map/impl/map-keys-to-array.js";
export { mapPush } from "./map/impl/map-push.js";
export { mapRemoveManyFromArray } from "./map/impl/map-remove-many-from-array.js";
export { mapRemoveOneFromArray } from "./map/impl/map-remove-one-from-array.js";
export { mapReportingAddToSet } from "./map/impl/map-reporting-add-to-set.js";
export { mapSetDifference } from "./map/impl/map-set-difference.js";
export { mapSymmetricDifference } from "./map/impl/map-symmetric-difference.js";
export { mapUnion } from "./map/impl/map-union.js";
export { mapValuesToArray } from "./map/impl/map-values-to-array.js";
export { mathBound } from "./math/impl/math-bound.js";
export { mathBoundRandom } from "./math/impl/math-bound-random.js";
export { mathHypot2 } from "./math/impl/math-hypot.js";
export { mathMax } from "./math/impl/math-max.js";
export { mathMin } from "./math/impl/math-min.js";
export { numberGetHexString } from "./number/impl/number-get-hex-string.js";
export { IRandomNumberGenerator } from "./number/random-numbers/i-random-number-generator.js";
export { NotRandomGenerator } from "./number/random-numbers/not-random-generator.js";
export { Mulberry32Generator } from "./number/random-numbers/mulberry-32-generator.js";
export { pathJoin } from "./path/impl/path-join.js";
export { regexEscapeRegex } from "./reg-exp/impl/regex-escape-regex.js";
export { setIsSetEqual } from "./set/impl/set-is-set-equal.js";
export { setSetDifference } from "./set/impl/set-set-difference.js";
export { setSymmetricDifference } from "./set/impl/set-symmetric-difference.js";
export { setValuesToArray } from "./set/impl/set-values-to-array.js";
export { stringNormalizeEmptyToUndefined } from "./string/impl/string-normalize-empty-to-undefined.js";
export { stringNormalizeNullUndefinedToEmpty } from "./string/impl/string-normalize-null-undefined-to-empty.js";
export { stringConcat2 } from "./string/impl/string-concat-2.js";
export { IIdentifierFactory } from "./identifier/impl/i-identifier-factory.js";
export { arrayMin } from "./array/impl/array-min.js";
export { DebugWeakBroadcastChannel } from "./debug/debug-weak-broadcast-event.js";
export { DebugSharedObjectLifeCycleChecker } from "./debug/debug-shared-object-life-cycle-checker.js";
export { TDebugListener } from "./debug/t-debug-listener.js";
export { Test_setDefaultFlags } from "./test-util/test_set-default-flags.js";
export { Test_resetLifeCycle } from "./test-util/test_reset-life-cycle.js";

declare global
{
    interface IBuildConstants extends IDebugBuildFlags,
                                      IWasmBuildFlags
    {
    }
}
