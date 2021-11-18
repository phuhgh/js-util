<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [SharedStaticArray](./rc-js-util.sharedstaticarray.md)

## SharedStaticArray class

Typed array representing static memory in wasm.

<b>Signature:</b>

```typescript
export declare class SharedStaticArray<TCtor extends TTypedArrayCtor> implements ISharedArray<TCtor>, IOnMemoryResize 
```
<b>Implements:</b> [ISharedArray](./rc-js-util.isharedarray.md)<!-- -->&lt;TCtor&gt;, [IOnMemoryResize](./rc-js-util.ionmemoryresize.md)

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(ctor, wrapper, pointer, length)](./rc-js-util.sharedstaticarray._constructor_.md) |  | Constructs a new instance of the <code>SharedStaticArray</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [ctor](./rc-js-util.sharedstaticarray.ctor.md) |  | TCtor |  |
|  [debugOnAllocate?](./rc-js-util.sharedstaticarray.debugonallocate.md) |  | (() =&gt; void) | <i>(Optional)</i> |
|  [elementByteSize](./rc-js-util.sharedstaticarray.elementbytesize.md) |  | number |  |
|  [length](./rc-js-util.sharedstaticarray.length.md) |  | number |  |
|  [onMemoryResize](./rc-js-util.sharedstaticarray.onmemoryresize.md) |  | () =&gt; void |  |
|  [sharedObject](./rc-js-util.sharedstaticarray.sharedobject.md) |  | [IReferenceCountedPtr](./rc-js-util.ireferencecountedptr.md) |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [createOneF32(wrapper, pointer, length)](./rc-js-util.sharedstaticarray.createonef32.md) | <code>static</code> |  |
|  [createOneF64(wrapper, pointer, length)](./rc-js-util.sharedstaticarray.createonef64.md) | <code>static</code> |  |
|  [getInstance()](./rc-js-util.sharedstaticarray.getinstance.md) |  |  |
