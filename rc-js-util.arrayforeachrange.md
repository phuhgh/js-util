<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [arrayForEachRange](./rc-js-util.arrayforeachrange.md)

## arrayForEachRange() function

Like [arrayForEach()](./rc-js-util.arrayforeach.md) with integer range as input.

<b>Signature:</b>

```typescript
export declare function arrayForEachRange(from: number, to: number, callback: (value: number, index: number) => void): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  from | number | The value to start from (inclusive). |
|  to | number | The value to finish with (inclusive). |
|  callback | (value: number, index: number) =&gt; void | Called for each value in the range. |

<b>Returns:</b>

void

## Remarks

Where `from` and `to` are equal a length 1 array is returned, NaN input is not supported.

See [arrayForEachRange()](./rc-js-util.arrayforeachrange.md)<!-- -->.
