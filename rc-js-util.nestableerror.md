<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [NestableError](./rc-js-util.nestableerror.md)

## NestableError class

Composable error, useful for automatically generating user friendly localized error messages.

<b>Signature:</b>

```typescript
export declare class NestableError<TLocalization> 
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(message, causedBy, stringifyMessage)](./rc-js-util.nestableerror._constructor_.md) |  | Constructs a new instance of the <code>NestableError</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [causedBy](./rc-js-util.nestableerror.causedby.md) |  | unknown |  |
|  [message](./rc-js-util.nestableerror.message.md) |  | TLocalization |  |
|  [stack](./rc-js-util.nestableerror.stack.md) |  | string |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [getRootCauseImpl(error, isLocalization, createNestableError)](./rc-js-util.nestableerror.getrootcauseimpl.md) | <code>static</code> | This should only be called by library extensions, not user code. |
|  [isErrorImpl(errorCtor, isLocalization, error)](./rc-js-util.nestableerror.iserrorimpl.md) | <code>static</code> | This should only be called by library extensions, not user code. |
|  [normalizeErrorImpl(error, isLocalization, createNestableError)](./rc-js-util.nestableerror.normalizeerrorimpl.md) | <code>static</code> | This should only be called by library extensions, not user code. |
|  [toString()](./rc-js-util.nestableerror.tostring.md) |  |  |
