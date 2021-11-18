<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [Range1d](./rc-js-util.range1d.md) &gt; [bound1d](./rc-js-util.range1d.bound1d.md)

## Range1d.bound1d() method

Bound this range to the argument.

<b>Signature:</b>

```typescript
bound1d(_boundTo: Range1d<TTypedArray>): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  \_boundTo | [Range1d](./rc-js-util.range1d.md)<!-- -->&lt;[TTypedArray](./rc-js-util.ttypedarray.md)<!-- -->&gt; |  |

<b>Returns:</b>

void

## Remarks

Where this range is larger than the bounding range, it will be resized to fit. Where this range is smaller than the bounding range but not contained, it will be moved maintaining its size. It Will be moved such that the the side furthest from the bounding range will be at the edge of the boundary.
