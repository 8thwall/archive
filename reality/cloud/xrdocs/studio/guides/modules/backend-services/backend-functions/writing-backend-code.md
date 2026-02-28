---
id: writing-backend-code
sidebar_position: 2
---

# Writing Backend Code

## Overview

Backend function code executes in a serverless environment associated with your 8th Wall account.
All backend functions must export a top level **async method** called `handler`, which is the entry
point into the backend function.

Example entry file code:

```javascript
const handler = async (event: any) => {
  // Custom backend code goes here

  return {
    body: JSON.stringify({
      myResponse,
    }),
  }
}

export {
  handler,
}
```

## Client Method

When you create a backend function, a client method is automatically created for you. This client
method is a wrapper around `fetch`, meaning you can pass the same arguments to this function as you
would with a normal `fetch` call. See [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
for more details.

This client method is how you send requests from module client code to the backend function.  

![FetchWrapper](/images/studio/bfn-fetch-wrapper.png)



## Function Event Parameters

The handler method is invoked with an `event` object each time the client method is called. `event`
has the following properties: 

| Property              | Type                   | Description                                                                                                  |
|-----------------------|------------------------|--------------------------------------------------------------------------------------------------------------|
| path                  | string                 | The URL path passed to the client method (`'/getUser/foo'` , `'/checkAnswer'`, etc).                         |
| body                  | string                 | Call `JSON.parse(event.body)` to get transform the body into an object.                                      |
| httpMethod            | string                 | The HTTP method used to call the backend function. One of `'GET'`, `'PUT'`, `'POST'`, `'PATCH'`, `'DELETE'`. |
| queryStringParameters | Record<string, string> | Key/value pairs containg the query string parameters from the request.                                       |
| headers               | Record<string, string> | Key/value pairs containing request headers.                                                                  |

## Return Object

All properties are optional.

| Property   | Type                   | Description                                                        |
|------------|------------------------|--------------------------------------------------------------------|
| statusCode | number                 | The status code of the response. Default is `200`.                 |
| headers    | Record<string, string> | The headers associated with the response.                          |
| body       | string                 | The `JSON.stringify()`'d body object associated with the response. |

## Error Handling


If the backend function throws an uncaught exception, the function will return `statusCode: 500`
with an error object in the response body.

If you **own** the module and are **in development mode**, the error object will contain `name`,
`message` and `stack`:

`{error: {name: string, message: string, stack: string}}`

Example:
```
{
  "error": {
    "name": "TypeError",
    "message": "Cannot read properties of undefined (reading 'foo')",
    "stack": "TypeError: Cannot read properties of undefined (reading 'foo')\n at call (webpack:///src/index.ts:8:24)\n ...
  }
}
```
For **non-development mode**, the error object will not contain a `name` or `stack` property and the
`message` will be a generic "Internal Server Error".

## Pinning Targets

Please refer to https://www.8thwall.com/docs/guides/modules/pinning-targets/ for full details on
module pinning targets.

When pinning to a `Version`, **Allowed Updates** must be set to `None`

![BFNVersionPinning](/images/studio/bfn-version-pinning.png)

When pinning to a `Commit`, select a specific commit.  `Latest` is not supported.

![BFNCommitPinning](/images/studio/bfn-commit-pinning.png)