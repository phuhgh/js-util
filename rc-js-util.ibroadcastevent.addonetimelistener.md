<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [IBroadcastEvent](./rc-js-util.ibroadcastevent.md) &gt; [addOneTimeListener](./rc-js-util.ibroadcastevent.addonetimelistener.md)

## IBroadcastEvent.addOneTimeListener() method

Like `addListener` but unregisters after first event.

<b>Signature:</b>

```typescript
addOneTimeListener(listener: TListener<TKey, TArgs>): () => void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  listener | [TListener](./rc-js-util.tlistener.md)<!-- -->&lt;TKey, TArgs&gt; |  |

<b>Returns:</b>

() =&gt; void
