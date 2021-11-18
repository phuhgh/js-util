<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rc-js-util](./rc-js-util.md) &gt; [\_Production](./rc-js-util._production.md) &gt; [createError](./rc-js-util._production.createerror.md)

## \_Production.createError() method

Creates an `Error` with the given message. If `DEBUG_MODE` is true and `DEBUG_DISABLE_BREAKPOINT_FLAG` is false or unset then a breakpoint will be hit first. Should not be used for "expected" errors (bad input etc).

<b>Signature:</b>

```typescript
static createError(message: string): Error;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  message | string |  |

<b>Returns:</b>

Error
