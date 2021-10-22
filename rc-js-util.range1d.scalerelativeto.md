<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [Range1d](./rc-js-util.range1d.md) &gt; [scaleRelativeTo](./rc-js-util.range1d.scalerelativeto.md)

## Range1d.scaleRelativeTo() method

Scales the range relative to a point (may not be outside of the range).

<b>Signature:</b>

```typescript
scaleRelativeTo<TResult extends TTypedArray = TArray>(_scalingFactor: number, _relativeTo: number, _result?: Range1d<TResult>): Range1d<TResult>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  \_scalingFactor | number |  |
|  \_relativeTo | number |  |
|  \_result | [Range1d](./rc-js-util.range1d.md)<!-- -->&lt;TResult&gt; |  |

<b>Returns:</b>

[Range1d](./rc-js-util.range1d.md)<!-- -->&lt;TResult&gt;

## Remarks

If the point is at a boundary, then the range will be scaled such that that boundary is not changed. Where the point is away from a boundary, the updated range will have boundaries proportional to the distance from the center of the range.

E.g. scaling factor of 0.5, P represents the position of the point in the range:

```
 min                       max
 |P-------------------------|
 |-------------|

 |------------P-------------|
       |-------------|
```
