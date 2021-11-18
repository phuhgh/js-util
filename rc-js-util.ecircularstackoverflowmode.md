<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [ECircularStackOverflowMode](./rc-js-util.ecircularstackoverflowmode.md)

## ECircularStackOverflowMode enum

Sets the behavior of [CircularFIFOStack](./rc-js-util.circularfifostack.md) when a value is pushed which won't fit.

<b>Signature:</b>

```typescript
export declare enum ECircularStackOverflowMode 
```

## Enumeration Members

|  Member | Value | Description |
|  --- | --- | --- |
|  Exception | <code>2</code> | Throw an error if the buffer overflows. |
|  Grow | <code>4</code> | Doubles the stack size and copies in place, running in O(size). |
|  NoOp | <code>1</code> | Do nothing. |
|  Overwrite | <code>3</code> | Overwrite the first value. |

## Remarks

Does not affect underflow, which is always considered exceptional.
