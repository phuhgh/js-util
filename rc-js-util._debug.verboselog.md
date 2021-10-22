<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [\_Debug](./rc-js-util._debug.md) &gt; [verboseLog](./rc-js-util._debug.verboselog.md)

## \_Debug.verboseLog() method

Logging which can be conditionally enabled by setting `DEBUG_VERBOSE` to true.

<b>Signature:</b>

```typescript
static verboseLog(message: string, ancillaryObject?: object): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  message | string |  |
|  ancillaryObject | object |  |

<b>Returns:</b>

void

## Example


```typescript
function foo(a1: number) {
    DEBUG_MODE && _Debug.verboseLog(`got me a ${a1}`);
}
```
