<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [mapAddToSet](./rc-js-util.mapaddtoset_1.md)

## mapAddToSet() function

Used with maps that store sets. Where a set exists for a given key the value will be added to that set, otherwise a new set will be created containing the value.

<b>Signature:</b>

```typescript
export declare function mapAddToSet<TKey extends object, TValue>(map: WeakMap<TKey, Set<TValue>>, key: TKey, value: TValue): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  map | WeakMap&lt;TKey, Set&lt;TValue&gt;&gt; | The <code>Map</code> to check. May be modified. |
|  key | TKey | The key to lookup in <code>map</code>. |
|  value | TValue | The value to add. |

<b>Returns:</b>

void

## Remarks

See [mapAddToSet()](./rc-js-util.mapaddtoset.md)<!-- -->.
