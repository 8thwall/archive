---
id: environment-variables
sidebar_position: 3
---

# Environment Variables

Environment variables allow you to keep sensitive information associated with your module safe.
For example, they allow you to store and pass authentication credentials without exposing
them directly in your code.

## Create Environment Variables

1. Select the back-end function within your module.
2. Click "New Environment Variable".

![NewEnvironmentVariable](/images/studio/bfn-new-environment-variable.png)

3. Define a Key (variable name)

![NewEnvironmentVariable](/images/studio/bfn-environment-variable-key.png)

4. Define a Label - this is the display name of the key that will be displayed to project using the
module containing the backend function.

![NewEnvironmentVariable](/images/studio/bfn-environment-variable-label.png)

## Access Environment Variable in Code

Environment variables can be accessed in your code as `process.env.<KEY>`

### Example:

``` ts
const API_KEY = process.env.api_key
```