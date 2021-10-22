<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [RawVoidPointer](./rc-js-util.rawvoidpointer.md)

## RawVoidPointer class

Provides a reference counted wrapper to a pointer `malloc`<!-- -->'d from JS and is `free`<!-- -->'d on reference count hitting 0.

<b>Signature:</b>

```typescript
export declare class RawVoidPointer implements IRawVoidPointer 
```
<b>Implements:</b> [IRawVoidPointer](./rc-js-util.irawvoidpointer.md)

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(wrapper, pointer, byteSize)](./rc-js-util.rawvoidpointer._constructor_.md) |  | Constructs a new instance of the <code>RawVoidPointer</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [byteSize](./rc-js-util.rawvoidpointer.bytesize.md) |  | number |  |
|  [debugOnAllocate?](./rc-js-util.rawvoidpointer.debugonallocate.md) |  | (() =&gt; void) | <i>(Optional)</i> |
|  [onMemoryResize](./rc-js-util.rawvoidpointer.onmemoryresize.md) |  | () =&gt; void |  |
|  [pointer](./rc-js-util.rawvoidpointer.pointer.md) |  | number |  |
|  [sharedObject](./rc-js-util.rawvoidpointer.sharedobject.md) |  | [IReferenceCountedPtr](./rc-js-util.ireferencecountedptr.md) |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [createOne(wrapper, byteSize)](./rc-js-util.rawvoidpointer.createone.md) | <code>static</code> |  |
|  [createOne(wrapper, byteSize, allocationFailThrows)](./rc-js-util.rawvoidpointer.createone_1.md) | <code>static</code> |  |
|  [getDataView()](./rc-js-util.rawvoidpointer.getdataview.md) |  |  |
